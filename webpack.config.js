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
    resolve: {
        modules: ['./dist/cdp.js'],
        extensions: ['', '.js'],
        alias: {
            jqueryI18next: "../node_modules/jquery-i18next/dist/umd/jquery-i18next.js",
            i18nextXHRBackend: "../node_modules/i18next-xhr-backend/dist/umd/i18nextXHRBackend.js",
            i18nextLocalStorageCache: "../node_modules/i18next-localstorage-cache/dist/umd/i18nextLocalStorageCache.js",
            i18nextSprintfPostProcessor: "../node_modules/i18next-sprintf-postprocessor/dist/umd/i18nextSprintfPostProcessor.js",
            i18nextBrowserLanguageDetector: "../node_modules/i18next-browser-languagedetector/dist/umd/i18nextBrowserLanguageDetector",
        },
    },
    module: {
        loaders: [
            {
                test: require.resolve("./dist/cdp"),
                loader: "imports-loader?this=>window"
            }
        ]
    }
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
