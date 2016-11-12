const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

// const concat = require('gulp-concat');
const watch = require('gulp-watch');
const del = require('del');
const copy = require('gulp-copy');

gulp.task('sass', function () {
  return gulp.src('./sass/main.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./sass'));
});

gulp.task('watch', function () {
  gulp.watch('sass/**/*.scss', ['autoprefix', 'del']);
});

gulp.task('autoprefix', ['sass'], () => {
    gulp.src('sass/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer('last 25 versions'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'))
});

gulp.task('copy', () => {
  return gulp.src('sass/PIE.htc')
    .pipe(copy('css', {prefix: 1}));
});

gulp.task('del', () => {
  return del('sass/main.css');
  // return gulp.src()
    // .pipe(del());
})

gulp.task('default', ['sass', 'autoprefix', 'copy', 'del', 'watch']);

// gulp.task('stream', function () {
//     // Endless stream mode
//     return watch('css/**/*.css', { ignoreInitial: false })
//         .pipe(gulp.dest('build'));
// });

// gulp.task('callback', function () {
//     // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
//     return watch('css/**/*.css', function () {
//         gulp.src('css/**/*.css')
//             .pipe(gulp.dest('build'));
//     });
// });

// //
// //

// // 'use strict';

// // var gulp = require('gulp');
// // var sass = require('gulp-sass');

// gulp.task('sass', function () {
//   return gulp.src('./sass/**/*.scss')
//     .pipe(sass.sync().on('error', sass.logError))
//     .pipe(gulp.dest('./css'));
// });

// gulp.task('sass:watch', function () {
//   gulp.watch('./sass/**/*.scss', ['sass']);
// });

// //
// //

// // const gulp = require('gulp');
// // const sourcemaps = require('gulp-sourcemaps');
// // const autoprefixer = require('gulp-autoprefixer');
// // const concat = require('gulp-concat');

// gulp.task('default', () =>
//     gulp.src('src/**/*.css')
//         .pipe(sourcemaps.init())
//         .pipe(autoprefixer())
//         .pipe(concat('all.css'))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('dist'))
// );