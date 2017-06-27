const path      = require('path');
const webpack   = require('webpack');
const banner    = require('./tasks/banner');
const config    = require('./project.config');

module.exports = {
    entry: {
        index: './built/cdp.i18n-lib.js',
    },
    output: {
        path: path.resolve(__dirname, 'built'),
        filename: 'cdp.i18n.js',
        library: 'CDP',
        libraryTarget: 'umd',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre",
            },
        ],
    },
    externals: {
        'jquery': {
            root: 'jQuery',
            commonjs: 'jquery',
            commonjs2: 'jquery',
            amd: 'jquery'
        },
        'cdp.core': {
            root: 'CDP',
            commonjs: 'cdp.core',
            commonjs2: 'cdp.core',
            amd: 'cdp.core'
        },
        'cdp.promise': {
            root: 'CDP',
            commonjs: 'cdp.promise',
            commonjs2: 'cdp.promise',
            amd: 'cdp.promise'
        },
    },
    resolve: {
        alias: {
            jqueryI18next: path.resolve(__dirname, 'external/i18next/scripts/jquery-i18next.js'),
            i18next: path.resolve(__dirname, 'external/i18next/scripts/i18next.js'),
            i18nextXHRBackend: path.resolve(__dirname, 'external/i18next/scripts/i18nextXHRBackend.js'),
            i18nextLocalStorageCache: path.resolve(__dirname, 'external/i18next/scripts/i18nextLocalStorageCache.js'),
            i18nextSprintfPostProcessor: path.resolve(__dirname, 'external/i18next/scripts/i18nextSprintfPostProcessor.js'),
            i18nextBrowserLanguageDetector: path.resolve(__dirname, 'external/i18next/scripts/i18nextBrowserLanguageDetector.js'),
        },
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new webpack.BannerPlugin({
            banner: banner('.js', config.main.basename),
            raw: true,
            ntryOnly: true,
        }),
    ],
};
