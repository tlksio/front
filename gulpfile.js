var gulp = require('gulp');
var jshint = require('gulp-jshint');
var less = require('gulp-less');

gulp.task('jshint', function () {
    gulp.src('*.js')
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

gulp.task('default', ['jshint', 'less'], function () {
});
