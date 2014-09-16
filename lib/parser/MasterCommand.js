
var Command = require('./Command');
var autoCloseCommand = require('./autoClose');

/**
 * Master命令节点类
 *
 * @constructor
 * @param {string} value 命令节点的value
 */
function MasterCommand( value ) {
    if ( !/^\s*([a-z0-9_-]+)\s*(\(\s*master\s*=\s*([a-z0-9_-]+)\s*\))?\s*/i.test( value ) ) {
        throw new Error( 'Invalid ' + this.type + ' syntax: ' + value );
    }

    this.master = RegExp.$3;
    this.name = RegExp.$1;
    Command.call( this, value );
    this.contents = {};
}


require('../util/inherits')(MasterCommand, Command);
Command.Types['master'] = MasterCommand;

/**
 * master节点open，解析开始
 *
 * @param {Object} context 语法分析环境对象
 */
MasterCommand.prototype.open = function (context) {
    autoCloseCommand(context);
    Command.prototype.open.call(this, context);
    context.masters.push(this);
    context.commands.push(this);
};

/**
 * 节点闭合，解析结束
 *
 * @param {Object} context 语法分析环境对象
 */
MasterCommand.prototype.close = function ( context ) {
    Command.prototype.close.call( this, context );
    context.targetOrMaster = null;
    this.endTag = 1;
};

/**
 * 节点闭合，解析结束。自闭合时被调用
 *
 * @param {Object} context 语法分析环境对象
 */
MasterCommand.prototype.autoClose = function ( context ) {
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
MasterCommand.prototype.convert = function (options) {
    var result = options.commandOpen + ' target: ' + this.name;

    if (this.master) {
        result += '(master = ' + this.master + ')';
    }

    result += ' ' + options.commandClose;
    result += Command.prototype.convert.call(this, options);

    if (this.endTag) {
        result = options.commandOpen + ' /target ' + options.commandClose;
    }

    return result;
};

module.exports = exports = MasterCommand;



