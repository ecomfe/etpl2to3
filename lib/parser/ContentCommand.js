

var Command = require('./Command');
var autoCloseCommand = require('./autoClose');

/**
 * Content命令节点类
 *
 * @constructor
 * @param {string} value 命令节点的value
 */
function ContentCommand( value ) {
    if (!/^\s*([a-z0-9_-]+)\s*$/i.test(value)) {
        throw new Error('Invalid ' + this.type + ' syntax: ' + value);
    }

    this.name = RegExp.$1;
    Command.call(this, value);
}


require('../util/inherits')(ContentCommand, Command);
Command.Types['content'] = ContentCommand;

/**
 * content节点open，解析开始
 *
 * @param {Object} context 语法分析环境对象
 */
ContentCommand.prototype.open = function (context) {
    autoCloseCommand(context, ContentCommand);
    Command.prototype.open.call(this, context);
};

/**
 * 节点自动闭合，解析结束
 *
 * @param {Object} context 语法分析环境对象
 */
ContentCommand.prototype.autoClose = Command.prototype.close;


/**
 * 节点闭合，解析结束
 *
 * @param {Object} context 语法分析环境对象
 */
ContentCommand.prototype.close = function (context) {
    Command.prototype.close.call(this, context);
    this.endTag = 1;
}

/**
 * 生成转换后的代码
 *
 * @param {Object} options 转换参数
 * @param {string} options.commandOpen 命令标签起始串
 * @param {string} options.commandClose 命令标签结束串
 * @return {string}
 */
ContentCommand.prototype.convert = function (options) {
    var result =
        options.commandOpen + ' block: ' + this.name + ' ' + options.commandClose
        + Command.prototype.convert.call(this, options)
        + options.commandOpen + ' /block ' + options.commandClose;

    if (!this.endTag) {
        result += '\n';
    }
    return result;
};

module.exports = exports = ContentCommand;
