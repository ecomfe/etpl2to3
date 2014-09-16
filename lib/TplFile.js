
var parse = require('./parser/parse');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');

var MasterCommand = require('./parser/MasterCommand');
var TargetCommand = require('./parser/TargetCommand');

/**
 * 模板文件转换处理类
 *
 * @constructor
 * @param {Object} options 转换参数
 * @param {string} options.commandOpen 命令标签起始串
 * @param {string} options.commandClose 命令标签结束串
 * @param {boolean} options.override 如果输出文件存在，是否覆盖
 * @param {string} inputFile 输入文件
 * @param {string} outputFile 输出文件
 * @param {string} shortName 用于错误输出的文件短路径
 */
function TplFile(options, inputFile, outputFile, shortName) {

    this.options = options || {};
    this.options.commandOpen = this.options.commandOpen || '<!--';
    this.options.commandClose = this.options.commandClose || '-->';

    this.inputFile = inputFile;
    this.outputFile = outputFile;
    this.shortName = shortName;

    if (!fs.existsSync(inputFile)) {
        throw new Error('Input Error: ' + inputFile + ' not exists!');
    }

    var ctx = parse(fs.readFileSync(inputFile, 'UTF-8'), options);
    this.commands = ctx.commands;
    this.targets = ctx.targets;
    this.masters = ctx.masters;

    // 如果etpl2里第一个是master，compile将返回第一个target
    // 但是转换成etpl3以后，会变成target，compile返回的target将不同
    // 所以需要将原先的第一个target提上来
    if (this.commands.length > 0 && this.commands[0] instanceof MasterCommand) {

        for (var i = 0; i < this.commands.length; i++) {
            var command = this.commands[i];

            if (command instanceof TargetCommand) {
                var firstTarget = this.commands.splice(i, 1)[0];
                this.commands.unshift(firstTarget);
                break;
            }
        }

    }
}

/**
 * 转换当前文件
 *
 * @return {string}
 */
TplFile.prototype.convert = function () {
    var record = {};
    this.targets.forEach(function (target) {
        record[target.name] = 1;
    });

    this.masters.forEach(
        function (master) {
            if (record[master.name]) {
                throw new Error('Name Conflict: In ' + this.shortName
                    + ', Master has the same name with Target ' + master.name
                    + ', please rename your master manually!');
            }
        },
        this
    );


    var result = '';
    var options = this.options;

    this.commands.forEach(function (command) {
        result += command.convert(options);
    });

    return result;
};

/**
 * 输出到文件
 */
TplFile.prototype.output = function () {
    var result = this.convert();

    if (this.outputFile) {
        if (!this.options.override && fs.existsSync(this.outputFile)) {
            throw new Error('Output Error: ' + this.outputFile + ' exists!');
        }

        mkdirp.sync(path.dirname(this.outputFile));
        fs.writeFileSync(this.outputFile, result, 'UTF-8');
    }
    else {
        console.log(result);
    }
};

module.exports = exports = TplFile;
