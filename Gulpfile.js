var gulp    = require("gulp");
var watch   = require('gulp-watch');
var include = require('gulp-include');

gulp.task("watch", function() {
  watch({glob: 'js/**/*.js'}, function(files) {
    gulp.src('js/assets.js')
    .pipe(include())
    .pipe(gulp.dest('js/build'))

    gulp.src('js/vendor.js')
    .pipe(include())
    .pipe(gulp.dest('js/build'))
  });
});
