var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var historyApiFallback = require('connect-history-api-fallback');
var rev = require('gulp-rev');
var uglify = uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');

gulp.task('build', ['usemin', 'html', 'json']);

gulp.task('default', ['serve']);

gulp.task('html', function() {
  gulp.src('dev/modules/**/*.html')
  .pipe(gulp.dest('prod/modules'));
});

gulp.task('json', function() {
  gulp.src('dev/json/*.json')
  .pipe(gulp.dest('prod/json'));
});

gulp.task('serve', function() {

  browserSync.init({
    server: "./dev",
    middleware: [ historyApiFallback() ]
  });

  gulp.watch("dev/*.html").on('change', browserSync.reload);
  gulp.watch("dev/**/*.js").on('change', browserSync.reload);
});

gulp.task('usemin', function() {
  gulp.src('dev/index.html')
  .pipe(usemin({
    scripts: [ uglify(), rev() ]
  }))
  .pipe(gulp.dest('prod'));
});
