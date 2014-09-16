

var Stack = require('../util/Stack');
var Command = require('./Command');
var TextNode = require('./TextNode');
var TargetCommand = require('./TargetCommand');
var MasterCommand = require('./MasterCommand');
var ContentCommand = require('./ContentCommand');
var ContentPlaceHolderCommand = require('./ContentPlaceHolderCommand');
var autoCloseCommand = require('./autoClose');

/**
 * 解析源代码
 *
 * @param {string} source 模板源代码
 * @param {Object} options parse选项
 * @return {Array} target名称列表
 */
function parse( source, options ) {
    options = options || {
        commandOpen: '<!--',
        commandClose: '-->'
    };

    var commandOpen = options.commandOpen;
    var commandClose = options.commandClose;

    var stack = new Stack();
    var analyseContext = {
        targets: [],
        masters: [],
        commands: [],
        stack: stack,
        scope: options.scope
    };

    // text节点内容缓冲区，用于合并多text
    var textBuf = [];

    /**
     * 将缓冲区中的text节点内容写入
     *
     * @inner
     */
    function flushTextBuf() {
        if ( textBuf.length > 0 ) {
            var text = textBuf.join('');
            var textNode = new TextNode( text );
            textNode.beforeAdd( analyseContext );

            stack.top().addChild( textNode );
            textBuf = [];
            analyseContext.current = textNode;
        }
    }

    var NodeType;

    /**
     * 判断节点是否是NodeType类型的实例
     * 用于在stack中find提供filter
     *
     * @inner
     * @param {Command} node 目标节点
     * @return {boolean}
     */
    function isInstanceofNodeType( node ) {
        return node instanceof NodeType;
    }

    parseTextBlock(
        source, commandOpen, commandClose, 0,

        function ( text ) { // <!--...-->内文本的处理函数
            var match = /^\s*(\/)?([a-z]+)\s*(:([\s\S]*))?$/.exec( text );

            // 符合command规则，并且存在相应的Command类，说明是合法有含义的Command
            // 否则，为不具有command含义的普通文本
            if ( match
                && ( NodeType = Command.Types[ match[2].toLowerCase() ] )
                && typeof NodeType == 'function'
            ) {
                // 先将缓冲区中的text节点内容写入
                flushTextBuf();

                var currentNode = analyseContext.current;

                if ( match[1] ) {
                    currentNode = stack.find( isInstanceofNodeType );
                    currentNode && currentNode.close( analyseContext );
                }
                else {
                    currentNode = new NodeType( match[4] );
                    if ( typeof currentNode.beforeOpen == 'function' ) {
                        currentNode.beforeOpen( analyseContext );
                    }
                    currentNode.open( analyseContext );
                }

                analyseContext.current = currentNode;
            }
            else if ( !/^\s*\/\//.test( text ) ) {
                // 如果不是模板注释，则作为普通文本，写入缓冲区
                textBuf.push( commandOpen, text, commandClose );
            }

            NodeType = null;
        },

        function ( text ) { // <!--...-->外，普通文本的处理函数
            // 普通文本直接写入缓冲区
            textBuf.push( text );
        }
    );


    flushTextBuf(); // 将缓冲区中的text节点内容写入
    autoCloseCommand( analyseContext );

    return analyseContext;
}

/**
 * 解析文本片段中以固定字符串开头和结尾的包含块
 * 用于 命令串：<!-- ... --> 和 变量替换串：${...} 的解析
 *
 * @inner
 * @param {string} source 要解析的文本
 * @param {string} open 包含块开头
 * @param {string} close 包含块结束
 * @param {boolean} greedy 是否贪婪匹配
 * @param {function({string})} onInBlock 包含块内文本的处理函数
 * @param {function({string})} onOutBlock 非包含块内文本的处理函数
 */
function parseTextBlock( source, open, close, greedy, onInBlock, onOutBlock ) {
    var closeLen = close.length;
    var texts = source.split( open );
    var level = 0;
    var buf = [];

    for ( var i = 0, len = texts.length; i < len; i++ ) {
        var text = texts[ i ];

        if ( i ) {
            var openBegin = 1;
            level++;
            while ( 1 ) {
                var closeIndex = text.indexOf( close );
                if ( closeIndex < 0 ) {
                    buf.push( level > 1 && openBegin ? open : '', text );
                    break;
                }

                level = greedy ? level - 1 : 0;
                buf.push(
                    level > 0 && openBegin ? open : '',
                    text.slice( 0, closeIndex ),
                    level > 0 ? close : ''
                );
                text = text.slice( closeIndex + closeLen );
                openBegin = 0;

                if ( level === 0 ) {
                    break;
                }
            }

            if ( level === 0 ) {
                onInBlock( buf.join( '' ) );
                onOutBlock( text );
                buf = [];
            }
        }
        else {
            text && onOutBlock( text );
        }
    }

    if ( level > 0 && buf.length > 0 ) {
        onOutBlock( open );
        onOutBlock( buf.join( '' ) );
    }
}

module.exports = exports = parse;




