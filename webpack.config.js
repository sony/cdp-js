// var webpack = require('webpack');

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
        //root: './dist',
        //alias: {
        //    'cdp/core': './cdp/core',
        //},
    },
    module: {
        loaders: [
            {
                test: require.resolve("./dist/cdp"),
                loader: "imports-loader?this=>window"
            }
        ]
    },
    //plugins: [
    //    new webpack.optimize.LimitChunkCountPlugin({
    //        maxChunks: 1,
    //    }),
    //],
};
