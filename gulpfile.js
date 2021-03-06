'use strict';

var gulp  = require('gulp'),
  plugins = require('gulp-load-plugins')({camelize: true}),
  argv    = require('yargs').argv,
  run     = require('run-sequence'),
  pkg     = require('./package.json'),
  dest    = './.tmp';

var paths = {
  html: {
    src: ['./app/*.html'],
    dest: dest
  },
  scripts: {
    src: ['./app/scripts/**/*.js', './app/scripts/**/*.jsx'],
    dest: dest + '/js'
  },
  styles: {
    src: ['./app/styles/**/*.scss'],
    dest: dest + '/css'
  },
  images: {
    src: ['./app/images/**/*.*'],
    dest: dest + '/images'
  },
  icons: {
    src: ['./app/icons/**/*.svg'],
    dest: {
      fonts: './app/fonts',
      scss: './app/styles'
    }
  },
  fonts: {
    src: ['./app/fonts/**/*.*'],
    dest: dest + '/fonts'
  },
  documents: {
    src: ['./app/documents/**/*.*'],
    dest: dest + '/documents'
  }
};

var opts = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  env: argv.env || 'dev',
  port: argv.port || 1337,
  webpackConfig: require('./webpack.config.js'),
  iconFontName: 'IconFont',
  autoprefixerBrowsers: [
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 6',
    'opera >= 23',
    'ios >= 6',
    'android >= 4.3',
    'bb >= 10'
  ],
  reportTemplate: function(warning, file, line, id, reason) {
    return warning + ' \'' + plugins.util.colors.cyan(file) + ':' + plugins.util.colors.magenta(line) + '\' ' + id + ': ' + reason;
  }
};

gulp.task('clean', require('./tasks/clean')(gulp, plugins, dest));
gulp.task('serve', require('./tasks/serve')(gulp, plugins, paths, opts));
gulp.task('html', require('./tasks/html')(gulp, plugins, paths, opts));
gulp.task('icons', require('./tasks/icons')(gulp, plugins, paths, opts));
gulp.task('images', require('./tasks/images')(gulp, plugins, paths, opts));
gulp.task('fonts', require('./tasks/copy')(gulp, plugins, paths.fonts.src, paths.fonts.dest));
gulp.task('documents', require('./tasks/copy')(gulp, plugins, paths.documents.src, paths.documents.dest));
gulp.task('scripts', require('./tasks/scripts')(gulp, plugins, paths, opts));
gulp.task('styles', require('./tasks/styles')(gulp, plugins, paths, opts));

gulp.task('build', function(callback) {
  run('clean', ['scripts', 'html', 'styles', 'images', 'fonts', 'documents'], callback);
});

gulp.task('default', function(callback) {
  run('clean', ['serve', 'html', 'styles', 'images', 'fonts', 'documents'], callback);
  gulp.watch(paths.html.src, ['html']);
  gulp.watch(paths.styles.src, ['styles']);
  gulp.watch(paths.icons.src, ['icons']);
  gulp.watch(paths.images.src, ['images']);
  gulp.watch(paths.fonts.src, ['fonts']);
  gulp.watch(paths.documents.src, ['documents']);
});
