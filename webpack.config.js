'use strict';
var path = require('path');
// var webpack = require('webpack');
var env = process.env.NODE_ENV;

let config = {
    entry: {
        index :'./app/js/index.js'
    },
    output: {
        // path: './app/js/',
        filename: '[name].bundle.js'
    }
};

module.exports = config;
