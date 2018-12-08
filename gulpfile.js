var browserify = require('browserify'),
  concat = require('gulp-concat'),
  gulp = require('gulp'),
  insert = require('gulp-insert'),
  package = require('./package.json'),
  replace = require('gulp-replace'),
  source = require('vinyl-source-stream');
  streamify = require('gulp-streamify'),
  uglify = require('gulp-uglify'),
  yargs = require('yargs');

var srcDir = './src/';
var srcFiles = srcDir + '**.js';
var buildDir = './';
var docsDir = './example/';

var header = "";

gulp.task('default', ['build', 'watch']);
gulp.task('build', buildTask);
gulp.task('watch', watchTask);

var argv = yargs
  .option('force-output', {default: false})
  .option('silent-errors', {default: false})
  .option('verbose', {default: false})
  .argv;

function buildTask() {
  var nonBundled = browserify('./src/index.js')
    .ignore('chart.js')
    .bundle()
    .pipe(source('Chart.MinMaxRange.js'))
    .pipe(insert.prepend(header))
    .pipe(streamify(replace('{{ version }}', package.version)))
    .pipe(gulp.dest(buildDir))
    .pipe(gulp.dest(docsDir))
    .pipe(streamify(uglify()))
    .pipe(streamify(concat('Chart.MinMaxRange.min.js')))
    .pipe(gulp.dest(buildDir));

  return nonBundled;

}

function watchTask() {
  return gulp.watch(srcFiles, ['build']);
}
