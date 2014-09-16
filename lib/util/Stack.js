
/**
 * 栈
 *
 * @constructor
 */
function Stack() {
    this.raw = [];
    this.length = 0;
}

Stack.prototype = {
    /**
     * 添加元素进栈
     *
     * @param {*} elem 添加项
     */
    push: function ( elem ) {
        this.raw[this.length++] = elem;
    },

    /**
     * 弹出顶部元素
     *
     * @return {*}
     */
    pop: function () {
        if (this.length) {
            var elem = this.raw[--this.length];
            this.raw.length = this.length;
            return elem;
        }
    },

    /**
     * 获取顶部元素
     *
     * @return {*}
     */
    top: function () {
        return this.raw[this.length - 1];
    },

    /**
     * 获取底部元素
     *
     * @return {*}
     */
    bottom: function () {
        return this.raw[0];
    },

    /**
     * 根据查询条件获取元素
     *
     * @param {Function} condition 查询函数
     * @return {*}
     */
    find: function (condition) {
        var index = this.length;
        while (index--) {
            var item = this.raw[index];
            if (condition(item)) {
                return item;
            }
        }
    }
};

module.exports = exports = Stack;
