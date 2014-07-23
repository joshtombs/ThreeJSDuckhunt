var gulp     = require("gulp");
var watch    = require('gulp-watch');
var include  = require('gulp-include');
var concat   = require('gulp-concat');
var template = require('gulp-template-compile');

gulp.task("watch", function() {
  watch({glob: 'js/**/*.js'}, function(files) {
    gulp.src('js/assets.js')
    .pipe(include())
    .pipe(gulp.dest('js/build'))

    gulp.src('js/vendor.js')
    .pipe(include())
    .pipe(gulp.dest('js/build'))
  });

  watch({glob: 'templates/**/*.html'}, function(files) {
    gulp.src('templates/*.html')
    .pipe(template({
      name: function (file) {
          return file.relative.split(".")[0];
      }
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('js/build'));
  });
});
