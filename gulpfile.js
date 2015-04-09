
var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var csso = require('gulp-csso');
var frontmatter = require('front-matter');
var fs = require('fs');
var ghpages = require('gh-pages');
var gjade = require('gulp-jade');
var glob = require('glob');
var gutil = require('gulp-util');
var ignore = require('gulp-ignore');
var jade = require('jade');
var less = require('gulp-less');
var markdown = require('gulp-markdown-to-json');
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

// Utilities

var jadeUtils = {
  getSections: getSections,
  getArticles: getArticles
};

function getArticles() {
  return glob.sync('journal/**/*.md')
  .map(function (filepath) {
    var data = frontmatter(fs.readFileSync(filepath, 'utf-8')).attributes;
    data.slug = getSlug(data.slug || path.relative(path.resolve('journal'), filepath));
    data.author = data.author && require('./journal/authors/' + data.author);
    return data;
  })
  .sort(function (a, b) {
    return -(a.slug.localeCompare(b.slug));
  });
}

function getSections(name) {
  name = String(name || '');
  return [
    {
      slug: '/',
      name: 'Manifesto'
    },
    {
      slug: '/journal/',
      name: 'Journal'
    }
  ].map(function (section) {
    section.active = (section.name.toLowerCase() === name.toLowerCase()) ? 'active' : '';
    return section;
  });
}

var slugRE = /^(\d\d\d\d)[-\/\\](\d\d)[-\/\\](\d\d)[-\/\\]([^\.]*)/i;

function getSlug(slug) {
  var match = String(slug).match(slugRE);

  if (match) {
    return match.slice(1, 5).join('/');
  }

  return slug;
}

// Tasks

function runJS() {
  return bundler.bundle()
    .pipe(isDist ? through() : plumber())
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
}

gulp.task('js', runJS);

gulp.task('journal', function() {
  return gulp.src('journal/**/*.md')
    .pipe(markdown({ }))
    .pipe(through(function (file) {
      var data = JSON.parse(file.contents.toString('utf-8'));

      data.slug = getSlug(data.slug || path.relative(file.base, file.path));
      data.author = data.author && require('./journal/authors/' + data.author);

      var content = jade.renderFile('src/templates/journal_article.jade', {
        article: data,
        utils: jadeUtils
      });

      file.path = path.resolve(file.base, data.slug + '/index.html');
      file.contents = new Buffer(content);

      this.queue(file);
    }))
    .pipe(gulp.dest('dist/journal'))
    .pipe(connect.reload());
});

gulp.task('html', ['clean:html', 'journal'], function() {
  return gulp.src('src/*.jade')
    .pipe(ignore.exclude('_*'))
    .pipe(isDist ? through() : plumber())
    .pipe(gjade({
      jade: jade,
      pretty: true,
      locals: {
        utils: jadeUtils
      }
    }))
    .pipe(through(function(file) {
      if (file.path === path.resolve('src/index.html')) {
        file.path = path.resolve('src');
      }

      this.queue(file);
    }))
    // Hack!
    .pipe(rename({ extname: '/index.html' }))
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
  gulp.watch('journal/**/*.md', ['html']);
  gulp.watch('src/**/*.jade', ['html']);
  gulp.watch('src/styles/**/*.less', ['css']);
  gulp.watch('src/images/**/*', ['images']);

  bundler.on('update', function() {
    runJS()
  });
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
