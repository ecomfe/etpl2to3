
/**
 * 文本节点类
 *
 * @constructor
 * @param {string} value 文本节点的内容文本
 * @param {Engine} engine 引擎实例
 */
function TextNode(value) {
    this.value = value;
}

TextNode.prototype = {
    /**
     * 文本节点被添加到分析环境前的处理动作：节点不在target中时，自动创建匿名target
     *
     * @param {Object} context 语法分析环境对象
     */
    beforeAdd:  function (context) {
        if (context.stack.bottom()) {
            return;
        }

        var TargetCommand = require('./TargetCommand');
        var target = new TargetCommand();
        target.open(context);
    },

    /**
     * 生成转换后的代码
     *
     * @return {string}
     */
    convert: function () {
        return this.value;
    }
};

module.exports = exports = TextNode;

