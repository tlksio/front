var path = require('path');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var coveralls = require('gulp-coveralls');
var less = require('gulp-less');
var phantom = require('gulp-phantom');
var del = require('del');

gulp.task('dist-clean', ['clean'], function() {
    'use strict';

    del([
        'config.json',
        'node_modules',
        'coverage',
        'public/components'
    ], function(err, delfiles) {
        if (err) {
            return err;
        }
        return delfiles;
    });
});

gulp.task('clean', function() {
    'use strict';

    var dest = path.join(__dirname, 'public', 'css', 'app.css');
    del([dest, 'log'], function(err, delfiles) {
        if (err) {
            return err;
        }
        return delfiles;
    });
});

gulp.task('csslint', function() {
    'use strict';

    return gulp.src('./public/css/**/*.css')
        .pipe(csslint('.csslintrc'))
        .pipe(csslint.reporter())
        .pipe(csslint.failReporter());
});

gulp.task('minify-css', ['less'], function() {
    'use strict';

    return gulp.src('./public/css/app.css')
        .pipe(sourcemaps.init())
        .pipe(minifyCSS({
            //keepBreaks: true
        }))
        .pipe(gulp.dest('./public/css'));
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
        .pipe(jshint.reporter('jshint-reporter-jscs'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('less', function() {
    'use strict';

    var dest = path.join(__dirname, 'public', 'css');
    return gulp.src('./src/less/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'src', 'less')]
        }))
        .pipe(gulp.dest(dest));
});

gulp.task('phantom', function() {
    'use strict';

    return gulp.src('./test/*.js')
        .pipe(phantom())
        .pipe(gulp.dest('./test'));
});

gulp.task('coveralls', function() {
    "use strict";
    gulp.src('./coverage/**/lcov.info')
        .pipe(coveralls());
});

gulp.task('default', [
    'clean',
    'jshint',
    'less',
    'csslint',
], function() {});
