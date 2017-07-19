/* eslint-env node, es6 */
'use strict';
const fs        = require('fs');
const path      = require('path');
const config    = require('../project.config');

const CONFIG_JS_PATH = path.join(__dirname, '..', config.dir.pkg, config.dir.script, 'config.js');
const STRING_REPLACE = (() => {
    if (config.build_settings) {
        return config.build_settings.string_replace;
    }
    return null;
})();

function queryOptions() {
    const argv = process.argv.slice(2);

    let options = {};

    if (0 < argv.length) {
        argv.forEach((arg) => {
            const option = arg.replace(/^--/, '');
            const setting = option.split('=');
            options[setting[0]] = setting[1] || '';
        });
    }

    return options;
}

function stringReplace(options) {
    if (options.length <= 0 || null == STRING_REPLACE) {
        return;
    }

    let config_ts = fs.readFileSync(CONFIG_JS_PATH).toString();

    Object.keys(STRING_REPLACE).forEach((opt) => {
        if (null != options[opt]) {
            const context = STRING_REPLACE[opt];
            Object.keys(context).forEach((target) => {
                let replaceText = options[opt];
                if ('string' === typeof context[target]) {
                    const replaceList = context[target].split('|');
                    if (1 === replaceList.length) {
                        if ('' === replaceText) {
                            replaceText = replaceList[0];
                        }
                    } else {
                        // valid options
                        if (replaceList.indexOf(replaceText) < 0) {
                            console.error(`invalid string replace target. [key:"${target}", accept: "(${context[target]})",  input:"${replaceText}"]`);
                            process.exit(1);
                        }
                    }
                } else if ('boolean' === typeof context[target] && context[target]) {
                    replaceText = '';
                }
                const regexp = new RegExp(target, 'gm');
                config_ts = config_ts.replace(regexp, replaceText);
            });
        }
    });

    fs.writeFileSync(CONFIG_JS_PATH, config_ts, 'utf-8');
}

function main() {
    stringReplace(queryOptions());
}

main();
