var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var historyApiFallback = require('connect-history-api-fallback');

gulp.task('default', ['serve']);

gulp.task('serve', function() {

  browserSync.init({
    server: "./dev",
    middleware: [ historyApiFallback() ]
  });

  gulp.watch("dev/*.html").on('change', browserSync.reload);
  gulp.watch("dev/**/*.js").on('change', browserSync.reload);
});
