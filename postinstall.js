(function () {

    function copyExportsSources() {
        var fs = require('fs-extra');
        var path = require('path');
        var glob = require('glob');

        var targets = [
            'cdp-core',
            'cdp-promise',
            'cdp-i18n',
            'cdp-framework-jqm',
            'cdp-tools',
            'cdp-ui-listview',
            'cdp-ui-jqm',
        ];

        var exports = [];
        targets.forEach(function (target) {
            var location = path.join('node_modules', target, 'exports') + '/**/*.ts';
            var files = glob.sync(location, {
                cwd: process.cwd(),
                nodir: true,
            });
            exports = exports.concat(files);
        });

        // copy
        exports.forEach(function (source) {
            var src = path.join(process.cwd(), source);
            var dst = path.join(process.cwd(), 'src', source.replace(/node_modules\/[\s\S]*?\/exports\//, ''));
            if (fs.existsSync(dst)) {
                fs.unlinkSync(dst);
                console.log('removed: ' + source.replace(/node_modules\/[\s\S]*?\/exports\//, ''));
            }
            fs.copySync(src, dst);
        });
    }

    try {
        // call deploy proc
        require('cdp-external-module-deployer').deploy();
        // copy "export" implementation souce code.
        copyExportsSources();
    } catch (error) {
        // noop.
    }
}());
