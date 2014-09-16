
var Command = require('./Command');
var autoCloseCommand = require('./autoClose');

/**
 * Target命令节点类
 *
 * @constructor
 * @param {string} value 命令节点的value
 */
function TargetCommand( value ) {
    value = value || '__unnamed__';
    if ( !/^\s*([a-z0-9_-]+)\s*(\(\s*master\s*=\s*([a-z0-9_-]+)\s*\))?\s*/i.test( value ) ) {
        throw new Error( 'Invalid ' + this.type + ' syntax: ' + value );
    }

    this.master = RegExp.$3;
    this.name = RegExp.$1;
    Command.call( this, value );
    this.contents = {};
}

require('../util/inherits')(TargetCommand, Command);
Command.Types['target'] = TargetCommand;

/**
 * master节点open，解析开始
 *
 * @param {Object} context 语法分析环境对象
 */
TargetCommand.prototype.open = function (context) {
    autoCloseCommand(context);
    Command.prototype.open.call(this, context);
    context.targets.push(this);
    context.commands.push(this);
};


/**
 * 节点闭合，解析结束
 *
 * @param {Object} context 语法分析环境对象
 */
TargetCommand.prototype.close =function ( context ) {
    Command.prototype.close.call( this, context );
    context.targetOrMaster = null;
    this.endTag = 1;
};

/**
 * 节点闭合，解析结束。自闭合时被调用
 *
 * @param {Object} context 语法分析环境对象
 */
TargetCommand.prototype.autoClose = function ( context ) {
    Command.prototype.close.call( this, context );
    context.targetOrMaster = null;
};

/**
 * 生成转换后的代码
 *
 * @param {Object} options 转换参数
 * @param {string} options.commandOpen 命令标签起始串
 * @param {string} options.commandClose 命令标签结束串
 * @return {string}
 */
TargetCommand.prototype.convert = function (options) {
    var result = '';

    if (this.name !== '__unnamed__') {
        result += options.commandOpen + ' target: ' + this.name;

        if (this.master) {
            result += '(master = ' + this.master + ')';
        }

        result += ' ' + options.commandClose;
    }

    result += Command.prototype.convert.call(this, options);
    if (this.endTag) {
        result += options.commandOpen + ' /target ' + options.commandClose;
    }
    return result;
};



module.exports = exports = TargetCommand;



