const gulp = require("gulp");
const handlebars = require("gulp-compile-handlebars");
const glob = require("glob");
const path = require("path");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();

const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const gutil = require("gulp-util");
const merge = require("merge-stream");
const tinypng = require("gulp-tinypng");

require("./src/script/build");

const isProd = process.env.NODE_ENV === "production";

function reload(done) {
  browserSync.reload();
  done();
}

var getData = function() {
  var templateData = {};

  glob.sync("./data/**/*.json").forEach(function(file) {
    templateData[
      file.replace(/\.json$/, "").replace(/^.*data\//, "")
    ] = require(path.resolve(file));
  });
  return templateData;
};

function bundle(file) {
  var b = browserify({
    entries: "./src/script/" + file,
    debug: true
  }).transform("babelify", {
    presets: [
      [
        "env",
        {
          targets: {
            browsers: ["last 2 versions", "ie 9-11"]
          }
        }
      ]
    ]
  });

  let currentBundle = b
    .bundle()
    .pipe(source(file))
    .pipe(buffer());

  if (isProd) {
    // currentBundle = currentBundle.pipe(uglify());
  }

  return currentBundle
    .on("error", gutil.log)
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/script/"));
}

gulp.task("js", function() {
  let contact = gulp.src("src/script/contact.js");

  if (isProd) {
    contact = contact.pipe(uglify());
  }

  return merge(
    bundle("cms.js"),
    bundle("embeded.js"),
    contact.pipe(gulp.dest("./dist/script"))
  );
});

gulp.task("copy-files", function() {
  return gulp
    .src([
      "src/**/*",
      "!src/**/*.html",
      "!src/script/**/*.*",
      "!src/**/*.css",
      "!src/**/*.jpg",
      "!src/**/*.png"
    ])
    .pipe(gulp.dest("./dist"));
});

gulp.task("html", function() {
  return gulp
    .src("src/**/*.html")
    .pipe(handlebars(getData(), {}))
    .pipe(gulp.dest("./dist"));
});

gulp.task("css", function() {
  return gulp
    .src("src/**/*.css")
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(gulp.dest("./dist"));
});

gulp.task("images", function() {
  let images = gulp.src(["src/**/*.jpg", "src/**/*.png"]);

  if (isProd && process.env.TINY_PNG_KEY) {
    images = images.pipe(tinypng(process.env.TINY_PNG_KEY));
  }

  return images.pipe(gulp.dest("./dist"));
});

gulp.task("reload", function() {
  reload();
});

gulp.task("reload-js", ["js"], reload);
gulp.task("reload-css", ["css"], reload);
gulp.task("reload-html", ["html"], reload);
gulp.task("reload-images", ["images"], reload);
gulp.task("reload-copy-files", ["copy-files"], reload);

gulp.task("build", ["copy-files", "html", "js", "css", "images"]);
gulp.task("default", ["build"], function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  gulp.watch(
    [
      "src/**/*",
      "!src/**/*.html",
      "!src/script/**/*.*",
      "!src/**/*.css",
      "!src/**/*.jpg",
      "!src/**/*.png"
    ],
    ["reload-copy-files"]
  );
  gulp.watch("src/**/*.css", ["reload-css"]);
  gulp.watch("src/script/**/*.*", ["reload-js"]);
  gulp.watch("src/**/*.html", ["reload-html"]);
  gulp.watch(["src/**/*.jpg", "src/**/*.png"], ["reload-images"]);
});
