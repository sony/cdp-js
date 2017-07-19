/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs');
const glob      = require('glob');
const config    = require('../project.config');

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        rename: true,
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('rename' === name) {
                    settings.rename = option.split('=')[1] || true;
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

function packageForExternalCSS(options) {
    const cwd = path.join(__dirname, '..', config.dir.external, 'cdp', config.dir.stylesheet);
    glob.sync('**/?(*.css|*.map)', {
        cwd: cwd,
    }).forEach((file) => {
        const src = path.join(cwd, file);
        if (fs.statSync(src).isFile()) {
            let fileName = file;
            let code = fs.readFileSync(src).toString();
            if (options.rename) {
                const checker = [];
                config.include_modules.forEach((target) => {
                    const regexp = new RegExp(target.replace(/-/g, '.'), 'g');
                    checker.push(regexp);
                });

                for (let i = 0, n = checker.length; i < n; i++) {
                    if (checker[i].test(fileName)) {
                        fileName = fileName.replace(checker[i], config.main.basename);
                        code = code.replace(checker[i], config.main.basename);
                        break;
                    }
                }
            }
            fs.writeFileSync(path.join(__dirname, '..', config.dir.pkg, fileName), code);
        }
    });
}

function main() {
    const options = queryOptions();
    packageForExternalCSS(options);
}

main();
