'use strict';

module.exports = function(gulp, plugins, paths, opts) {
  return function() {
    var stream = gulp.src(paths.images.src)
    .pipe(plugins.newer(paths.images.dest))
    .pipe(plugins.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(paths.images.dest));
    return stream;
  };
};
