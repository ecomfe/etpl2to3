
/**
 * 命令节点类
 *
 * @constructor
 * @param {string} value 命令节点的value
 * @param {Engine} engine 引擎实例
 */
function Command( value ) {
    this.value = value;
    this.children = [];
}

Command.prototype = {
    /**
     * 添加子节点
     *
     * @param {TextNode|Command} node 子节点
     */
    addChild: function ( node ) {
        this.children.push( node );
    },

    /**
     * 节点open，解析开始
     *
     * @param {Object} context 语法分析环境对象
     */
    open: function ( context ) {
        var parent = context.stack.top();
        this.parent = parent;
        parent && parent.addChild( this );
        context.stack.push( this );
    },

    /**
     * 节点闭合，解析结束
     *
     * @param {Object} context 语法分析环境对象
     */
    close: function ( context ) {
        while (context.stack.pop().constructor !== this.constructor) {}
    },

    /**
     * 生成转换后的代码
     *
     * @param {Object} options 转换参数
     * @param {string} options.commandOpen 命令标签起始串
     * @param {string} options.commandClose 命令标签结束串
     * @return {string}
     */
    convert: function (options) {
        var result = '';
        this.children.forEach(function (child) {
            result += child.convert(options);
        });

        return result;
    }
};

Command.Types = {};

module.exports = exports = Command;
