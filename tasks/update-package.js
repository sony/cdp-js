/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs-extra');
const del       = require('del');
const config    = require('../project.config');

const dir = path.join(__dirname, '..');
const pkg = require(path.join(dir, 'package.json'));
const srcDir = path.join(__dirname, `../packages/${config.distribution_target}`);
const srcPackage = require(path.join(srcDir, 'package.json'));

// clean "dist"
del.sync(['**/*'], { cwd: path.join(dir, 'dist') });

// copy "dist"
fs.copySync(path.join(srcDir, 'dist'), path.join(dir, 'dist'));

// update package info
pkg.name        = srcPackage.name;
pkg.description = srcPackage.description;
pkg.version     = srcPackage.version;
pkg.main        = srcPackage.main;
pkg.types       = srcPackage.types;
pkg.author      = srcPackage.author;
pkg.license     = srcPackage.license;
pkg.keywords    = srcPackage.keywords;
fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
