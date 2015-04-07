var gulp = require('gulp');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var less = require('gulp-less');
var phantom = require('gulp-phantom');

gulp.task('csslint', function() {
    'use strict';

    return gulp.src('./public/css/**/*.css')
        .pipe(csslint())
        .pipe(csslint.reporter());
});

gulp.task('jshint', function() {
    'use strict';

    return gulp.src([
            './test/**/*.js',
            './lib/**/*.js',
            'index.js',
            'gulpfile.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('less', function() {
    'use strict';

    return gulp.src('./src/less/**/*.less')
        .pipe(less({}))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('phantom', function() {
    'use strict';

    return gulp.src('./test/*.js')
        .pipe(phantom())
        .pipe(gulp.dest('./test'));
});

gulp.task('default', ['jshint', 'less', 'csslint'], function() {});
