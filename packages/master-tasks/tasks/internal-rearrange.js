/* eslint-env node, es6 */
/* eslint-disable no-regex-spaces */
'use strict';
const fs        = require('fs-extra');
const path      = require('path');
const config    = require('../project.config');

const DST_PATH = path.join(__dirname, '..', config.dir.external, config.main.namespace, config.dir.script);
fs.ensureDirSync(DST_PATH);

function main() {
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

main();
