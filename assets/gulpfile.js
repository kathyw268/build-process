var gulp = require('gulp'); 

var jshint = require('gulp-jshint'),
	changed = require('gulp-changed'),
	imagemin = require('gulp-imagemin'),
	less = require('gulp-less'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	autoprefix = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'),
	sourcemaps = require('gulp-sourcemaps'),
  watch = require('gulp-watch'),
	browserSync = require('browser-sync').create();


// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "../"
        },
        index: "index.html"
    });
});

// JS hint
gulp.task('jshint', function() {
  gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Minify Images
gulp.task('imagemin', function() {
  var imgSrc = 'img/**/*',
      imgDst = '../build/img';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

// JS concat and minify
gulp.task('scripts', function() {
  gulp.src(['js/lib/*.js','./js/app/*.js'])
  	.pipe(sourcemaps.init())
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('../build/js/'));
});

gulp.task('styles', function() {
  gulp.src(['less/style.less'])
    .pipe(sourcemaps.init())
  	.pipe(less())
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('../build/styles/'))
    .pipe(browserSync.stream());
});

gulp.task('move', function() {
    gulp.src('fonts/**/*.{tff,woff,eof,svg,eot}')
    .pipe(gulp.dest('../build/fonts/'));
});

gulp.task('default', ['imagemin', 'scripts', 'styles', 'move'], function() {

});


gulp.task('dev', ['browser-sync', 'imagemin', 'jshint', 'scripts', 'styles'], function() {
  // watch html changes
  gulp.watch("../*.html").on('change', browserSync.reload);


  // watch for JS changes
  gulp.watch('js/**/*.js', ['jshint', 'scripts']).on('change', browserSync.reload);

  gulp.watch('img/**/*', ['imagemin']);

  // watch for CSS changes
  gulp.watch('less/**/*.less', ['styles']);
});