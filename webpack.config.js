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
        'jquery.mobile': true,
        'backbone': true,
        'underscore': true,
        'i18next': true,
        'i18nextXHRBackend': true,
        'i18nextLocalStorageCache': true,
        'i18nextSprintfPostProcessor': true,
        'i18nextBrowserLanguageDetector': true,
        'jqueryI18next': true,
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
