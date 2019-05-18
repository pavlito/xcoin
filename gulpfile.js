'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var fileinclude = require('gulp-file-include');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var beep = require('beepbeep');


gulp.task('log', function() {
    gutil.log('test');
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./app",
            index: "index.html",
            injectChanges: true,
        }
    });
});

gulp.task('fileinclude', function() {
    return gulp.src(['templates/*.html'])
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest('app/'))
      .pipe(browserSync.stream())
})


gulp.task('clean-libs', function (){
    return del([
        "app/libs"
    ]);
});

gulp.task('copy', function() {
    return gulp.src([
            'node_modules/popper.js/dist/umd/popper.min.js',
        ], { "base": "node_modules/" })
        .pipe(gulp.dest('app/libs/'))
});

// gulp.task('bootstrap-dev', function() {
//     return gulp.src([
//         'node_modules/bootstrap/scss/**/*'
//     ]).pipe(gulp.dest('sass/bootstrap'))
// })

gulp.task('sass', function() {
    // var src = gulp.src('./sass/**/*.scss');
    var src = gulp.src('./sass/**/*.scss');
    var dest = gulp.dest('app/css');
    return src
        .pipe(sourcemaps.init())
        .pipe(sass({ 'outputStyle': 'expanded', 'sync': true }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 5 versions', 'Firefox >= 10', 'iOS >=5', 'ie >= 9'],
            cascade: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest)
        .pipe(browserSync.stream());
});

gulp.task('watch:styles', function() {
    gulp.watch('./sass/**/*.scss', gulp.series('sass'), gulp.series(browserSync.reload))
});

gulp.task('watch:templates', function() {
    gulp.watch('./templates/**/*.html', gulp.series('fileinclude'))
    // gulp.watch('./templates/**/*.html').on('change', gulp.series('fileinclude', browserSync.reload))
})

gulp.task('watch:js', function() {
    gulp.watch(['app/js/*.js']).on('change', gulp.series(browserSync.reload))
});

gulp.task('watch', gulp.series('sass',
    gulp.parallel('watch:styles', 'watch:js', 'watch:templates')
));

gulp.task('default',gulp.series('clean-libs',  gulp.parallel('fileinclude', 'copy', 'watch', 'browser-sync')));

gulp.task('img', function() {
    return gulp.src('app/assets/**/*')
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('clean', function() {
    return del([
        "./dist"
    ]);
});


gulp.task('assets-html', function() {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('assets-css', function() {
    return gulp.src('app/css/**/*')
        .pipe(gulp.dest('dist/css'));
});

gulp.task('assets-js', function() {
    return gulp.src('app/js/*')
        .pipe(gulp.dest('dist/js'));
});
gulp.task('assets-libs', function() {
    return gulp.src('app/libs/**/*')
        .pipe(gulp.dest('dist/libs'));
});

gulp.task('assets-data', function() {
    return gulp.src('app/data/*.json')
        .pipe(gulp.dest('dist/data'));
});

gulp.task('assets-xml', function() {
    return gulp.src('app/*.xml')
        .pipe(gulp.dest('dist'))
})

gulp.task('assets-plugins', function() {
    return gulp.src('app/plugins/**/*')
        .pipe(gulp.dest('dist/plugins'))
})

gulp.task('assets', gulp.parallel(
    'assets-html', 
    'assets-css', 
    'assets-js', 
    'assets-libs', 
    'assets-data', 
    'assets-xml',
    'assets-plugins'));

gulp.task("build", gulp.series(
    'clean',
    gulp.parallel('copy', 'img', 'sass', 'fileinclude'),
    'assets'
));