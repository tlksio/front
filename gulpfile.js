var path = require('path');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var phantom = require('gulp-phantom');
var del = require('del');

gulp.task('dist-clean', ['clean'], function() {
    'use strict';

    del([
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
        .pipe(csslint())
        .pipe(csslint.reporter());
});

gulp.task('minify-css', ['less'], function() {
    'use strict';

    return gulp.src('./public/css/app.css')
        .pipe(sourcemaps.init())
        .pipe(minifyCSS({
            keepBreaks: true
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
        .pipe(jshint.reporter('jshint-stylish'))
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

gulp.task('default', [
    'clean',
    'jshint',
    'less',
    'csslint',
    'minify-css'
], function() {});
