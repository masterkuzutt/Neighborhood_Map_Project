const gulp = require('gulp');
const webpackStream = require("webpack-stream");
const webpack = require("webpack");

const webpackConfig = require('./webpack.config');

gulp.task('default', () => {
    // dest should be the same with webpack setings
    return webpackStream(webpackConfig, webpack).pipe(gulp.dest("app/js"));
})

gulp.watch('./app/js/*.js|./app/css/*.css', { ignored: './app/js/index.bundle.js' }).on('change', gulp.series('default'));




