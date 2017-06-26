const settings  = require('./testem.json');
const proj      = require('../../project.config');
const tsconfig  = require('../../src/tsconfig.all.json');

const module_scripts = [];
tsconfig.files.forEach((file) => {
    module_scripts.push({
        src: file.replace(/.ts$/i, '.js'),
    });
});

const config = {
    test_page: proj.dir.test + '/runner/index.mustache',
    module_scripts: module_scripts,
};

module.exports = Object.assign({}, settings, config);
