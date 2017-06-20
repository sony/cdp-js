const path      = require('path');
const settings  = require('./testem.json');
const generator = require('./config-generator');
const proj      = require('../../project.config');

const config = {
    before_tests: function (config, data, callback) {
        generator.setup();
        callback(null);
    },
    test_page: proj.dir.test + '/runner/index.mustache',
};

module.exports = Object.assign({}, settings, config);
