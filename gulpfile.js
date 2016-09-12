var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var webpack = require('webpack-stream');
// var webpack = require('webpack');
var webpack_config = require('./webpack.config.js');

gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('webpack', function () {
    return gulp.src('./app/js/index.js')
        .pipe(webpack(webpack_config))
        .pipe(gulp.dest('app/js/'));
});

gulp.task('watch', ['browserSync','sass','webpack'],function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
});
