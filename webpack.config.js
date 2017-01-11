module.exports = {
    entry: {
        index: './dist/cdp.js'
    },
    output: {
        path: './dist',
        filename: 'cdp.umd.js',
        library: 'CDP',
        libraryTarget: 'umd',
    },
    externals: {
        'jquery': true,
        'backbone': true,
        'underscore': true,
    },
    // TODO: cdp.framework.jqm と cdp.ui.jqm にて
    //
    // })(this, function(CDP) {
    // ↓
    // })((this || 0).self || global, function(CDP) {
    //
    // の対応を行わなければ CDP が global export されない

    // TODO:
    // amd の定義が解決できていない。常に undefined
};
