var gulp = require('gulp');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var less = require('gulp-less');

gulp.task('csslint', function () {
    gulp.src('./public/css/**/*.css')
    .pipe(csslint())
    .pipe(csslint.reporter());
});

gulp.task('jshint', function () {
    gulp.src(['./lib/**/*.js', './index.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('less', function () {
    gulp.src('./src/less/**/*.less')
    .pipe(less({
        paths: []
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('default', ['jshint', 'less', 'csslint'], function () {
});
