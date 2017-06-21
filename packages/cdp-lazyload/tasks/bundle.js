/* eslint-env node, es6 */
/* eslint-disable no-regex-spaces */
'use strict';
const fs        = require('fs');
const path      = require('path');
const banner    = require('./banner');
const config    = require('../project.config');

function main() {
    const SRC_PATH = path.join(__dirname, '..', config.dir.src, config.dir.script);
    const DST_PATH = path.join(__dirname, '..', config.dir.pkg);
    // source
    const src = fs.readFileSync(path.join(SRC_PATH, config.main.basename + '.js')).toString();
    const bundleSrc = '\ufeff' + banner('.js', config.main.basename) + src
            .replace(/^\ufeff/gm, '')    // remove bom
            .replace(/\r\n/gm, '\n')
    ;
    fs.writeFileSync(path.join(DST_PATH, config.main.basename + '.js'), bundleSrc);

    // d.ts
    const dts = fs.readFileSync(path.join(SRC_PATH, config.main.bundle_d_ts)).toString();
    const bundleDTS = '\ufeff' + banner('.d.ts', config.main.basename) + dts
            .replace(/^\ufeff/gm, '')    // remove bom
            .replace(/\r\n/gm, '\n')
    ;
    if (!fs.existsSync(path.join(DST_PATH, config.dir.types))) {
        fs.mkdirSync(path.join(DST_PATH, config.dir.types));
    }
    fs.writeFileSync(path.join(DST_PATH, config.dir.types, config.main.bundle_d_ts), bundleDTS);
}

main();
