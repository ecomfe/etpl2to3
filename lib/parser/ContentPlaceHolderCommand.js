

var Command = require('./Command');
var autoCloseCommand = require('./autoClose');

/**
 * ContentPlaceHolder命令节点类
 *
 * @constructor
 * @param {string} value 命令节点的value
 * @param {Engine} engine 引擎实例
 */
function ContentPlaceHolderCommand(value) {
    if (!/^\s*([a-z0-9_-]+)\s*$/i.test(value)) {
        throw new Error('Invalid ' + this.type + ' syntax: ' + value);
    }

    this.name = RegExp.$1;
    Command.call(this, value);
}


require('../util/inherits')(ContentPlaceHolderCommand, Command);
Command.Types['contentplaceholder'] = ContentPlaceHolderCommand;

/**
 * content节点open，解析开始
 *
 * @param {Object} context 语法分析环境对象
 */
ContentPlaceHolderCommand.prototype.open = function (context) {
    autoCloseCommand(context, ContentPlaceHolderCommand);
    Command.prototype.open.call(this, context);
};


/**
 * 节点自动闭合，解析结束
 * contentplaceholder的自动结束逻辑为，在其开始位置后马上结束
 * 所以，其自动结束时children应赋予其所属的parent，也就是master
 *
 * @param {Object} context 语法分析环境对象
 */
ContentPlaceHolderCommand.prototype.autoClose = function (context) {
    var parentChildren = this.parent.children;
    parentChildren.push.apply(parentChildren, this.children);
    this.children.length = 0;
    this.close(context);
};

/**
 * 生成转换后的代码
 *
 * @param {Object} options 转换参数
 * @param {string} options.commandOpen 命令标签起始串
 * @param {string} options.commandClose 命令标签结束串
 * @return {string}
 */
ContentPlaceHolderCommand.prototype.convert = function (options) {
    var result =
        options.commandOpen + ' block: ' + this.name + ' ' + options.commandClose
        + Command.prototype.convert.call(this, options)
        + options.commandOpen + ' /block ' + options.commandClose;

    return result;
};

module.exports = exports = ContentPlaceHolderCommand;
