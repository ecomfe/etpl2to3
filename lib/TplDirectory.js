
var fs = require('fs');
var path = require('path');
var TplFile = require('./TplFile');

/**
 * 模板目录转换处理类
 *
 * @constructor
 * @param {Object} options 转换参数
 * @param {string} options.commandOpen 命令标签起始串
 * @param {string} options.commandClose 命令标签结束串
 * @param {boolean} options.override 如果输出文件存在，是否覆盖
 * @param {string} extname 模板文件扩展名
 * @param {string} inputFile 输入目录
 * @param {string} outputFile 输出目录
 */
function TplDirectory(options, inputDir, outputDir) {
    this.files = [];
    this.options = options || {};
    this.inputDir = inputDir;
    this.outputDir = outputDir;

    var extname = this.options.extname || '.tpl.html';
    this.tplFileRule = new RegExp(extname + '$');

    this.readDirectory(inputDir);
}

/**
 * 读取目录
 *
 * @private
 * @param {string} dir 目录名
 */
TplDirectory.prototype.readDirectory = function (dir) {
    var files = fs.readdirSync(dir);

    for (var i = 0; i < files.length; i++) {
        var file = path.join(dir, files[i]);
        var stat = fs.statSync(file);

        if (stat.isDirectory()) {
            this.readDirectory(file);
        }
        else if (stat.isFile() && this.tplFileRule.test(file)) {
            var relativePath = path.relative(this.inputDir, file);
            var outputFile = this.outputDir && path.join(this.outputDir, relativePath);
            this.files.push(new TplFile(this.options, file, outputFile, relativePath));
        }
    }
};

/**
 * 输出到文件
 */
TplDirectory.prototype.output = function () {
    this.files.forEach(function (file) {
        file.output();
    });
};


module.exports = exports = TplDirectory;
