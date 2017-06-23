/* eslint-env node, es6 */
'use strict';
const fs        = require('fs');
const path      = require('path');
const srcmap    = require('./srcmap');
const config    = require('../project.config');

function main() {
    // copy d.ts
    const SRC_TYPES_DIR = path.join(__dirname, '..', `${config.dir.src}/${config.dir.script}`, config.dir.types);
    const DST_TYPES_DIR = path.join(__dirname, '..', config.dir.pkg, config.dir.types);

    if (!fs.existsSync(DST_TYPES_DIR)) {
        fs.mkdirSync(DST_TYPES_DIR);
    }

    fs.readdirSync(SRC_TYPES_DIR)
    .forEach((filePath) => {
        const src = path.join(SRC_TYPES_DIR, filePath);
        const dst = path.join(DST_TYPES_DIR, filePath);
        if (fs.statSync(src).isFile()) {
            fs.writeFileSync(dst, fs.readFileSync(src).toString(), 'utf8');
        }
    });

    {// separate source-map
        const BUILT_DIR = path.join(__dirname, '..', config.dir.built);
        const src = path.join(BUILT_DIR, config.main.basename + '.js');
        const libFile = path.join(BUILT_DIR, config.main.basename + '-lib.js');
        const mapFile = path.join(BUILT_DIR, config.main.basename + '-lib.map');

        const info = srcmap.separateScriptAndMapFromScriptFile(src, false, config.main.basename + '-lib.map');
        fs.writeFileSync(libFile, info.script);
        fs.writeFileSync(mapFile, info.map);
    }
}

main();
