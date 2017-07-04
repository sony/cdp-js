/* eslint-env node, es6 */
'use strict';
const fs        = require('fs');
const path      = require('path');
const srcmap    = require('./srcmap');
const config    = require('../project.config');

function main() {
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
