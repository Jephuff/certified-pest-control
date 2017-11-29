const mkdirp = require('mkdirp');
const gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
const Handlebars = require('handlebars');
const glob = require( 'glob' );
const path = require( 'path' );
var http = require('http');
var ecstatic = require('ecstatic');

const templateData = {};

const options = {}

glob.sync( './data/**/*.json' ).forEach(function( file ) {
    templateData[file.replace(/\.json$/, '').replace(/^.*data\//, '')] = require( path.resolve( file ) );
});

Handlebars.registerHelper('num', function(context) {
  switch('' + context) {
    case '0':
      return 'one';
    case '1':
      return 'two';
    case '2':
      return 'three';
    case '3':
      return 'four';
    default:
      return ''
  }
});

Handlebars.registerHelper('safe', function(context) {
  function strip_tags (input, allowed) {
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
      commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
  }

  var html = strip_tags(context, '<a>');
  return html;
});

console.log(templateData)

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