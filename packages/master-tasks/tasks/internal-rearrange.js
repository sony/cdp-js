/* eslint-env node, es6 */
/* eslint-disable no-regex-spaces */
'use strict';
const fs        = require('fs-extra');
const path      = require('path');
const config    = require('../project.config');

function rearrange_scripts() {
    if (!config.dir.script) {
        return;
    }

    const DST_PATH = path.join(__dirname, '..', config.dir.external, config.main.namespace, config.dir.script);
    fs.ensureDirSync(DST_PATH);

    if (config.internal_rearrange) {
        config.internal_rearrange.forEach((internal) => {
            const fileName = internal.replace(/-/g, '.') + '.js';
            const src = path.join(
                __dirname, '../..',
                internal, config.dir.pkg,
                fileName
            );
            const dst = path.join(DST_PATH, fileName);
            console.log('  update...   ' + fileName);
            fs.writeFileSync(dst, fs.readFileSync(src).toString(), 'utf8');
        });
    }
}

function rearrange_stylesheets() {
    if (!config.dir.stylesheet) {
        return;
    }

    const glob = require('glob');
    const DST_PATH = path.join(__dirname, '..', config.dir.external, config.main.namespace, config.dir.stylesheet);

    if (config.internal_rearrange) {
        config.internal_rearrange.forEach((internal) => {
            const cwd = path.join(__dirname, '../..', internal, config.dir.pkg);
            glob.sync('**/*.css', {
                cwd: cwd,
                ignore: ['**/*.min.css'],
                nodir: true,
            }).forEach((file) => {
                const src = path.join(cwd, file);
                const dst = path.join(DST_PATH, file);
                console.log('  update...   ' + file);
                fs.copySync(src, dst);
            });
        });
    }
}

function main() {
    rearrange_scripts();
    rearrange_stylesheets();
}

main();
