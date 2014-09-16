

var etpl2 = require('./etpl2');
var etpl3 = require('./etpl3');

var data = {
    name: 'etpl',
    str: 'string',
    num: 10,
    bool: true,
    list: [1, 2, 3, 4, 5],
    map: {
        one: 1,
        two: 2,
        three: 3
    },
    myList: [1, 2, 3, 4, 5],
    myObj: { "0":1, "1":2, "2":3, "3":4, "4":5 },
    persons: [
        {name: 'erik', email: 'errorrik@gmail.com'},
        {name: 'firede', email: 'firede@gmail.com'}
    ],
    personsIndex: {
        erik: {name: 'erik', email: 'errorrik@gmail.com'},
        firede: {name: 'firede', email: 'firede@gmail.com'}
    }
};

var fs = require('fs');
var path = require('path');
var TplFile = require('../lib/TplFile');
var TplDirectory = require('../lib/TplDirectory');

var filters = {
    'filter-lower': function (source, saveInitial) {
        if (saveInitial) {
            return source.charAt(0) + source.slice(1).toLowerCase();
        }
        return source.toLowerCase();
    },

    'filter-not': function (source) {
        return !source;
    },

    'for-incream': function (source, increament) {
        increament = increament || 1;
        var result = [];
        for (var i = 0; i < source.length; i++) {
            result[i] = source[i] + increament;
        }

        return result;
    },

    'var-emphasis': function (source, level) {
        level = level || 1;
        while (level--) {
            source = source + '!';
        }

        return source;
    },

    'use-prefix': function (source, prefix) {
        prefix = prefix || 'sb';
        return prefix + '-' + source;
    },

    'if-sum': function (source) {
        for (var i = 1; i < arguments.length; i++) {
            source += arguments[i];
        }

        return source;
    }
};

function rmdir( dir ) {
    if ( fs.existsSync( dir ) && fs.statSync( dir ).isDirectory() ) {
        fs.readdirSync( dir ).forEach(
            function ( file ) {
                var fullPath = path.join( dir, file );
                if ( fs.statSync( fullPath ).isDirectory() ) {
                    exports.rmdir( fullPath );
                }
                else {
                    fs.unlinkSync( fullPath );
                }
            }
        );
        fs.rmdirSync( dir );
    }
}

describe('All templates', function() {
    var files = fs.readdirSync(path.resolve(__dirname, './tpl'));

    // normal cases
    files.forEach(function (file) {

        if (!/\.tpl\.html$/.test(file)) {
            return;
        }

        file = path.resolve(__dirname, './tpl', file);
        var tplFile = new TplFile(null, file);

        it(file, function () {
            var etpl2Engine = new etpl2.Engine();
            var etpl3Engine = new etpl3.Engine();

            for (var filterName in filters) {
                etpl2Engine.addFilter(filterName, filters[filterName]);
                etpl3Engine.addFilter(filterName, filters[filterName]);
            }

            expect(etpl2Engine.compile(fs.readFileSync(file, 'UTF-8'))(data))
                .toEqual(etpl3Engine.compile(tplFile.convert())(data));

            tplFile.targets.forEach(function (target) {
                if (target.name !== '__unnamed__') {
                    expect(etpl2Engine.getRenderer(target.name)(data))
                        .toEqual(etpl3Engine.getRenderer(target.name)(data));
                }
            });
        });

    });

    // name conflict case
    var conflictFile = path.resolve(__dirname, './tpl', 'conflict.html');
    var conflictTpl = new TplFile(null, conflictFile)
    it(conflictFile, function () {
        try {
            conflictTpl.convert();
            expect(false).toBeTruthy();
        }
        catch (ex) {
            expect(ex.message.indexOf('Name Conflict')).toEqual(0);
        }
    });

    // output file test
    var oFile = 'target-and-master.tpl.html';
    var ooFile = 'target-and-master.tpl.html.output';
    var ooFilePath = path.resolve(__dirname, './tpl', ooFile);
    var oTplFile = new TplFile(
        null,
        path.resolve(__dirname, './tpl', oFile),
        ooFilePath,
        oFile
    );
    it('File Output', function () {
        oTplFile.output();
        expect(fs.readFileSync(ooFilePath, 'UTF-8'))
            .toEqual(oTplFile.convert());
        fs.unlinkSync(ooFilePath);
    });

    // output file override test
    var oTplFileOver = new TplFile(
        {override: 1},
        path.resolve(__dirname, './tpl', oFile),
        ooFilePath,
        oFile
    );
    it('File Output Override', function () {
        fs.writeFileSync(ooFilePath, '2b', 'UTF-8');
        oTplFileOver.output();
        expect(fs.readFileSync(ooFilePath, 'UTF-8'))
            .toEqual(oTplFileOver.convert());
        fs.unlinkSync(ooFilePath);
    });

    // output directory test
    var oDir = 'tpl';
    var ooDir = 'tpl-output';
    var ooDirPath = path.resolve(__dirname, ooDir);
    var oTplDir = new TplDirectory(
        null,
        path.resolve(__dirname, oDir),
        ooDirPath
    );
    it('Dir Output', function () {
        oTplDir.output();
        oTplDir.files.forEach(function (file) {
            expect(fs.existsSync(path.join(ooDirPath, file.shortName))).toBeTruthy();
        });
        rmdir(ooDirPath);
    });

    // output directory override test
    var oTplDirOver = new TplDirectory(
        {override: 1},
        path.resolve(__dirname, oDir),
        ooDirPath
    );
    it('Dir Output Override', function () {
        oTplDir.output();
        oTplDirOver.output();
        oTplDirOver.files.forEach(function (file) {
            expect(fs.existsSync(path.join(ooDirPath, file.shortName))).toBeTruthy();
        });
        rmdir(ooDirPath);
    });
});
