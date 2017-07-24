const path      = require('path');
const fs        = require('fs');
const http      = require('http');
const shell     = require('shelljs');
const proj      = require('../../project.config');
const tsconfig  = require('../../src/tsconfig.all.json');

const module_scripts = [];
tsconfig.files.forEach((file) => {
    module_scripts.push({
        src: file.replace(/.ts$/i, '.js'),
    });
});

const DOC_DIR       = path.join(__dirname, '../../', proj.dir.doc);
const REPORTS_DIR   = path.join(DOC_DIR, 'reports');
const COVERAGE_DIR  = path.join(REPORTS_DIR, 'coverage');

// ensure coverage dir
if (!fs.existsSync(DOC_DIR)) {
    fs.mkdirSync(DOC_DIR);
}
if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR);
}
if (!fs.existsSync(COVERAGE_DIR)) {
    fs.mkdirSync(COVERAGE_DIR);
}

let server;
const port = 7358;

const settings = require(path.join(__dirname, 'testem.json'));

const config = {
    proxies: {
        '/coverage': {
            'target': 'http://localhost:' + port,
        }
    },

    before_tests: function (config, data, callback) {
        // start the server
        server = http.createServer(function (req, res) {
            console.log('... Received coverage of', req.headers['content-length'], 'length');
            req.pipe(fs.createWriteStream(path.join(COVERAGE_DIR, 'coverage.json')));
            req.on('end', res.end.bind(res));
        }).listen(port, function (serverErr) {
            console.log(' Listening for coverage on ' + port);
            callback(serverErr);
        });
    },

    after_tests: function (config, data, callback) {
        server.close();
        callback(null);
    },

    test_page: proj.dir.test + '/runner/index.mustache',
    module_scripts: module_scripts,
};

module.exports = Object.assign({}, settings, config);
