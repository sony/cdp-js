/* eslint-env node, es6 */
/* eslint-disable no-regex-spaces */
'use strict';
const fs        = require('fs');
const path      = require('path');
const banner    = require('./banner');

function main() {
    const SRC_PATH = path.join(__dirname, '..', 'src/scripts');
    const DST_PATH = path.join(__dirname, '..', 'dist');
    // source
    const src = fs.readFileSync(path.join(SRC_PATH, 'cdp.core.js')).toString();
    const bundleSrc = '\ufeff' + banner('.js', 'cdp.core') + src
            .replace(/^\ufeff/gm, '')    // remove bom
            .replace(/\r\n/gm, '\n')
    ;
    fs.writeFileSync(path.join(DST_PATH, 'cdp.core.js'), bundleSrc);

    // d.ts
    const dts = fs.readFileSync(path.join(SRC_PATH, 'cdp.core.d.ts')).toString();
    const bundleDTS = '\ufeff' + banner('.d.ts', 'cdp.core') + dts
            .replace(/^\ufeff/gm, '')    // remove bom
            .replace(/\r\n/gm, '\n')
    ;
    if (!fs.existsSync(path.join(DST_PATH, '@types'))) {
        fs.mkdirSync(path.join(DST_PATH, '@types'));
    }
    fs.writeFileSync(path.join(DST_PATH, '@types', 'cdp.core.d.ts'), bundleDTS);
}

main();
