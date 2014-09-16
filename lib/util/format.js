

/**
 * 字符串格式化
 *
 * @param {string} source 目标模版字符串
 * @param {...string} replacements 字符串替换项集合
 * @return {string}
 */
function format(source) {
    var args = arguments;

    return source.replace(
        /\{([0-9]+)\}/g,
        function (match, index) {
            return args[index - 0 + 1];
        });
}

module.exports = exports = format;

