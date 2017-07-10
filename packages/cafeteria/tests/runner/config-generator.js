/* eslint-env node, es6 */
'use strict';
const path  = require('path');
const fs    = require('fs-extra');
const _     = require('lodash');
const proj  = require('../../project.config');

const CONFIG_TS_PATH = path.join(__dirname, '../../', proj.dir.src, proj.dir.script, 'config.ts');

const app       = proj.dir.src;
const external  = proj.dir.external;
const lib       = proj.dir.lib;
const porting   = proj.dir.porting;
const scripts   = proj.dir.script;

const config_template = (() => {
    return `
    // dynamic configuration for requirejs
    // GENERATED FILE - DO NOT EDIT
    window.Config = window.Config || {};
    Config.requirejs = (function () {
        var _index = function (path) {
            return '${app}/' + path;
        };
        var _module = function (name, file) {
            return _index('${external}/') + name + '/${scripts}/' +(file ? file: name);
        };
        var _lib = function (name) {
            return _index('${lib}/${scripts}/') + name;
        };
        var _porting = function (name) {
            return _index('${porting}/${scripts}/') + name;
        };
        var _assign_package = function (_config, _path, name, main) {
            _config.packages = _config.packages || [];
            _config.packages.push({
                name: name,
                location: _path(name),
                main: main,
            });
        };

        var config = {
            <%= paths %>
        };
        var assign_lib = _assign_package.bind(null, config, _lib);
        var assign_porting = _assign_package.bind(null, config, _porting);

        <%= packages %>

        return config;
    }) ();
`
    ;
})();

// read "config.ts"
const config_ts = fs.readFileSync(CONFIG_TS_PATH).toString();

const paths = (() => {
    // ">>>EXTERNAL_MODULES>>>" *** " // <<<EXTERNAL_MODULES<<<
    const code = config_ts.match(/\/\/ >>>EXTERNAL_MODULES[\s\S]*?\/\/ <<<EXTERNAL_MODULES<<</);
    if (code) {
        return code;
    } else {
        return 'paths: {},';
    }
})();

const packages = (() => {
    // ">>>LIB_DEPENDENCIES>>>" *** " // <<<LIB_DEPENDENCIES<<<
    const code = config_ts.match(/\/\/ >>>LIB_DEPENDENCIES[\s\S]*?\/\/ <<<LIB_DEPENDENCIES<<</);
    if (code) {
        return code;
    } else {
        return '';
    }
})();

function setup() {
    const src = _.template(config_template)({ paths: paths, packages: packages }).replace(/\r\n/gm, '\n');
    fs.writeFileSync(path.join(__dirname, 'test-config.js'), src, 'utf8');
}

module.exports = {
    setup: setup,
};
