const mkdirp = require('mkdirp');
const gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
const glob = require( 'glob' );
const path = require( 'path' );

const templateData = {};
const options = {}


glob.sync( './data/**/*.json' ).forEach(function( file ) {
    console.log(file);
    templateData[file.replace(/\.json$/, '').replace(/^.*data\//, '')] = require( path.resolve( file ) );
});
console.log(templateData.home);


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