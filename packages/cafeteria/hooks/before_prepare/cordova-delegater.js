#!/usr/bin/env node

const path      = require('path');
const config    = require('../../project.config');
const receiver  = require(path.join('../../', config.dir.task, 'cordova-receiver'));

receiver([
    'build',
    'emulate',
    'run',
    'prepare',
]);
