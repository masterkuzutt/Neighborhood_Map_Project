// Imports: Dependencies
require('dotenv').config();
require("babel-register");

const webpack = require('webpack');
const path = require('path');

// Webpack Configuration
const config = {

    // Entry  
    entry: { path: './app/js/index.js' },
    // Output
    output: {
        path: path.resolve(__dirname, './app/js'),
        filename: 'index.bundle.js',
        publicPath: '/js',
    },
    node: {
        fs: 'empty',
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    // Loaders
    module: {
        rules: [
            // JavaScript/JSX Files 
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            // CSS Files
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    // Plugins
    plugins: [
        new webpack.DefinePlugin({
            'process.env.BINGMAPS_API_KEY': '"' + process.env.BINGMAPS_API_KEY + '"',
        }),
    ],
    // OPTIONAL
    // Reload On File Change
    // watch: true,
    // // Development Tools (Map Errors To Source File)
    // devtool: 'source-map',
    devtool: 'inline-source-map',

};
// Exports
module.exports = config;;
