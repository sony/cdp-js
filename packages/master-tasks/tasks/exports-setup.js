/* eslint-env node, es6 */
'use strict';
const fs        = require('fs-extra');
const path      = require('path');
const glob      = require('glob');
const config    = require('../project.config');

const DST_PATH = path.join(__dirname, '..', config.dir.src, config.dir.script);

function setup_exports() {
    if (config.include_modules) {
        config.include_modules.forEach((target) => {
            const cwd = path.join(__dirname, '../..', target, config.dir.exports);
            glob.sync('**/*.ts', {
                cwd: cwd,
            }).forEach((file) => {
                console.log('  setup...   ' + file);
                const src = path.join(cwd, file);
                const dst = path.join(DST_PATH, file);
                fs.copySync(src, dst);
            });
        });
    }
}

function setup_d_ts() {
    if (config.include_modules) {
        config.include_modules.forEach((target) => {
            console.log('  @types setup...   ' + target);
            const src = path.join(__dirname, '../..', target, config.dir.pkg, config.dir.types);
            fs.copySync(src, path.join(DST_PATH, config.dir.types));
        });
    }
}

function main() {
    setup_exports();
    setup_d_ts();
}

main();
