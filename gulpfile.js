
var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var csso = require('gulp-csso');
var ghpages = require('gh-pages');
var gutil = require('gulp-util');
var ignore = require('gulp-ignore');
var jade = require('gulp-jade');
var less = require('gulp-less');
var opn = require('opn');
var path = require('path');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var rimraf = require('gulp-rimraf');
var source = require('vinyl-source-stream');
var through = require('through');
var uglify = require('gulp-uglify');

var watchify = require('watchify');
var browserify = require('browserify');

var pkg = require('./package.json');

var isDist = process.argv.indexOf('serve') === -1;

var bundler = watchify(browserify(path.resolve(__dirname, 'src/scripts/main.js'), watchify.args));

bundler.transform('babelify', {
  experimental: true
});

bundler.transform('debowerify');

gulp.task('js', ['clean:js'], function() {
  return bundler.bundle()
    .pipe(isDist ? through() : plumber())
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
});

gulp.task('html', ['clean:html'], function() {
  return gulp.src('src/*.jade')
    .pipe(ignore.exclude('_*'))
    .pipe(isDist ? through() : plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('css', ['clean:css'], function() {
  return gulp.src('src/styles/*.less')
    .pipe(isDist ? through() : plumber(function () {}))
    .pipe(less({
      // Allow CSS to be imported from node_modules and bower_components
      'paths': ['./node_modules', './bower_components']
    }))
    .pipe(autoprefixer('last 2 versions', {
      map: false
    }))
    .pipe(isDist ? csso() : through())
    .pipe(rename(function (path) {
      path.extname = '.css';
    }))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
});

gulp.task('images', ['clean:images'], function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('dist/images'))
    .pipe(connect.reload());
});

gulp.task('cname', function() {
  return gulp.src('CNAME')
    .pipe(gulp.dest('dist'));
});

gulp.task('favicons', function() {
  return gulp.src('src/favicons/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  return gulp.src('dist')
    .pipe(rimraf());
});

gulp.task('clean:html', function() {
  return gulp.src('dist/index.html')
    .pipe(rimraf());
});

gulp.task('clean:js', function() {
  return gulp.src('dist/build/build.js')
    .pipe(rimraf());
});

gulp.task('clean:css', function() {
  return gulp.src('dist/build/build.css')
    .pipe(rimraf());
});

gulp.task('clean:images', function() {
  return gulp.src('dist/images')
    .pipe(rimraf());
});

gulp.task('connect', ['build'], function(done) {
  connect.server({
    port: 4444,
    root: 'dist',
    livereload: true
  });

  opn('http://localhost:4444', done);
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.jade', ['html']);
  gulp.watch('src/styles/**/*.less', ['css']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch([
    'src/scripts/**/*.js'
  ], ['js']);
});

gulp.task('deploy', ['build'], function(done) {
  bundler.close();
  ghpages.publish(path.join(__dirname, 'dist'), {
    logger: gutil.log,
    branch: 'master'
  }, done);
});

gulp.task('build', ['js', 'html', 'css', 'images', 'favicons', 'cname']);
gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['build'], function() {
  bundler.close();
});
