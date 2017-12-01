var mkdirp = require('mkdirp');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var glob = require( 'glob' );
var path = require( 'path' );
var http = require('http');
var ecstatic = require('ecstatic');
var build = require('./src/script/build'); // adds handlebar helpers

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');


var getData = function() {
  var templateData = {};

  glob.sync( './data/**/*.json' ).forEach(function( file ) {
      templateData[file.replace(/\.json$/, '').replace(/^.*data\//, '')] = require( path.resolve( file ) );
  });
  return templateData
}

function bundle(file) {
  var b = browserify({
    entries: './src/script/' + file,
    debug: true
  });

  return b.bundle()
    .pipe(source(file))
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        // .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/script/'));
}

gulp.task('bundle', function () {
  // set up the browserify instance on a task basis
  bundle('cms.js');
  bundle('embeded.js');
});

gulp.task('copy-files', function() {
    return gulp.src(['src/**/*', '!src/**/*.html', '!src/script/**/*.*'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy-html', function() {
    return gulp.src('src/**/*.html')
        .pipe(handlebars(getData(), {}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['copy-files', 'copy-html', 'bundle']);

gulp.task('default', ['build'], function(){
  http.createServer(
    ecstatic({ root: __dirname + '/dist' })
  ).listen(8081);

  gulp.watch('src/**/*.*', function(){
    gulp.run('build');
  });
});