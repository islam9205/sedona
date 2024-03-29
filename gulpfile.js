const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const htmlmin = require("gulp-htmlmin");
const sync = require("browser-sync").create();
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const squoosh = require("gulp-libsquoosh");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");


// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// html

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
}

exports.html = html;

// optimizeImages

const optimizeImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img"))
}

exports.optimizeImages = optimizeImages;

// copyImages

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg)")
    .pipe(gulp.dest("build/img"))
}

exports.copyImages = copyImages;

// webp

const createWebp = () => {
  gulp.src("source/img/**/*{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}

// sprite

const sprite = () => {
    return gulp
        .src('source/img/**/*.svg', { base: 'src/sprite' })
        .pipe(rename({prefix: 'icon-'}))
        .pipe(svgstore())
        .pipe(gulp.dest('build/img'));
}

exports.sprite = sprite;

// Copy

const copy = (dony) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// clean

const clean = () => {
  return del("build");
}

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);

/*

// build

const build = gulp.series(
  clean,
  cope,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    sprite,
    createWebp
  )
);

exports.default = gulp.series(
  clean,
  cope,
  copyImages,
  gulp.parallel(
    styles,
    html,
    sprite,
    createWebp
  ),
  server,
  watcher
);

*/
