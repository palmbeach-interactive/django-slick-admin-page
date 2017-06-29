'use strict';

var config = require('./gulp-settings.json');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

var fs = require('fs');

var PROJECT_ROOT = __dirname;

var PROJECT_PATH = {
    'sass': PROJECT_ROOT + '/src/sass',
    'base': PROJECT_ROOT + '/node_modules/milligram/src',
    'css': PROJECT_ROOT + '/css',
};

var PROJECT_SASS_SRC = [
    PROJECT_PATH.base + '/milligram.sass',
    PROJECT_PATH.sass + '/screen.sass'
];

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4'
];


gulp.task('proxy', ['styles'], function () {

    browserSync.init({
        notify: false,
        port: config.local_port,
        host: config.hostname,
        //open: "external",
        open: false,
        proxy: {
            target: "127.0.0.1:" + config.proxy_port
        },
        ui: {
            port: config.local_port + 1,
            weinre: {
                port: config.local_port + 2
            }
        }
    });

    gulp.watch(PROJECT_PATH.sass + '/**/*.sass', ['styles']);
});


gulp.task('styles', function () {
    return gulp.src(PROJECT_SASS_SRC)
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 10
        }))
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(PROJECT_PATH.css))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .pipe($.size({title: 'stylesheet size:'}));
});


gulp.task('dist', function () {
    return gulp.src(PROJECT_SASS_SRC)
        .pipe($.sass({
            outputStyle: 'compressed',
            sourceComments: false,
            precision: 10
        }))
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe($.stripCssComments({}))
        .pipe(gulp.dest(PROJECT_PATH.css))
        .pipe($.size({title: 'stylesheet size:'}));
});


gulp.task('default', ['proxy']);
gulp.task('watch', ['proxy']);
