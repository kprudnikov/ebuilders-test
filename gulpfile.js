const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

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

gulp.task('copy-normalize',  () => {
  return gulp.src('node_modules/normalize.css/normalize.css')
    .pipe(copy('css', {prefix: 2}));
})

gulp.task('del', ['autoprefix'], () => {
  return del('sass/main.css');
});

gulp.task('default', ['sass', 'autoprefix', 'copy', 'copy-normalize', 'del', 'watch']);