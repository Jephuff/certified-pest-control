const mkdirp = require('mkdirp');
const gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
const glob = require( 'glob' );
const path = require( 'path' );
var http = require('http');
var ecstatic = require('ecstatic');

const templateData = {};

const options = {}

glob.sync( './data/**/*.json' ).forEach(function( file ) {
    templateData[file.replace(/\.json$/, '').replace(/^.*data\//, '')] = require( path.resolve( file ) );
});

gulp.task('copy-files', function() {
    return gulp.src(['src/**/*', '!src/**/*.html'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy-html', function() {
    return gulp.src('src/**/*.html')
        .pipe(handlebars(templateData, options))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['copy-files', 'copy-html']);

gulp.task('default', function(){
  http.createServer(
    ecstatic({ root: __dirname + '/dist' })
  ).listen(8080);

  gulp.watch('src/**/*.*', function(){
    gulp.run('build');
  });
});