
/**
 * 命令自动闭合
 *
 * @param {Object} context 语法分析环境对象
 * @param {Function=} CommandType 自闭合的节点类型
 */
function autoClose( context, CommandType ) {
    var stack = context.stack;
    var closeEnd = CommandType
        ? stack.find( function ( item ) {
            return item instanceof CommandType;
        } )
        : stack.bottom();

    if ( closeEnd ) {
        var node;

        do {
            node = stack.top();

            // 如果节点对象不包含autoClose方法
            // 则认为该节点不支持自动闭合，需要抛出错误
            // for等节点不支持自动闭合
            if ( !node.autoClose ) {
                throw new Error( node.type + ' must be closed manually: ' + node.value );
            }
            node.autoClose( context );
        } while ( node !== closeEnd );
    }

    return closeEnd;
}

module.exports = exports = autoClose;
