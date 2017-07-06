const path      = require('path');
const webpack   = require('webpack');
const banner    = require('./tasks/banner');
const config    = require('./project.config');

module.exports = {
    entry: {
        index: './built/cdp.framework.jqm-lib.js',
    },
    output: {
        path: path.resolve(__dirname, 'built'),
        filename: 'cdp.framework.jqm.js',
        library: ['CDP', 'Framework'],
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
            {
                use: ["imports-loader?this=>window"],
            },
        ],
    },
    externals: {
        'backbone': {
            root: 'Backbone',
            commonjs: 'backbone',
            commonjs2: 'backbone',
            amd: 'backbone'
        },
        'jquery': {
            root: 'jQuery',
            commonjs: 'jquery',
            commonjs2: 'jquery',
            amd: 'jquery'
        },
        'cdp.promise': {
            root: 'CDP',
            commonjs: 'cdp.promise',
            commonjs2: 'cdp.promise',
            amd: 'cdp.promise'
        },
        'cdp.i18n': {
            root: 'CDP',
            commonjs: 'cdp.i18n',
            commonjs2: 'cdp.i18n',
            amd: 'cdp.i18n'
        },
    },
    resolve: {
        alias: {
            'jquery-migrate': path.resolve(__dirname, 'external/jquery/scripts/jquery-migrate.js'),
            'jquery.mobile': path.resolve(__dirname, 'external/jquery/scripts/jquery.mobile.js'),
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
