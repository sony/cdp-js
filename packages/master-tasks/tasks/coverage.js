/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs');
const config    = require('../project.config');

const SRC_DIR = path.join(__dirname, '..', config.dir.src, config.dir.script);
const COVERAGE_PATH = path.join(__dirname, '..', config.dir.doc, 'reports/coverage', 'coverage.json');

const coverage = require(COVERAGE_PATH);

function main() {
    console.log('remap coverage info...');

    let rebuild = {};
    for (let file in coverage) {
        if (coverage.hasOwnProperty(file)) {
            console.log('  processing... : ' + file);
            const absPath = path.join(SRC_DIR, file);
            rebuild[absPath] = coverage[file];
            rebuild[absPath].path = absPath;
        }
    }

    fs.writeFileSync(COVERAGE_PATH,
      JSON.stringify(rebuild, null, 4),
      'utf-8'
    );
}

main();
