/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs');
const NYC       = require('nyc');
const convert   = require('convert-source-map');
const config    = require('../project.config');

const BUILT_DIR     = path.join(__dirname, '..', config.dir.built);
const COVERAGE_PATH = path.join(__dirname, '..', config.dir.doc, 'reports/coverage', 'coverage.json');

const coverage = require(COVERAGE_PATH);

function main() {
    const nyc = new NYC();

    const detectMapFile = (srcPath) => {
        if (fs.existsSync(srcPath + '.map')) {
            return JSON.parse(fs.readFileSync(srcPath + '.map').toString());
        } else {
            return convert.fromComment(fs.readFileSync(srcPath).toString()).toObject();
        }
    };

    console.log('remap coverage info...');

    let rebuild = {};
    for (let file in coverage) {
        console.log('  processing... : ' + file);
        const absPath = path.join(BUILT_DIR, file);
        rebuild[absPath] = coverage[file];
        rebuild[absPath].path = absPath;
        rebuild[absPath].inputSourceMap = detectMapFile(absPath);
    }

    rebuild = nyc.sourceMaps.remapCoverage(rebuild);

    fs.writeFileSync(COVERAGE_PATH,
      JSON.stringify(rebuild, null, 4),
      'utf-8'
    );
}

main();
