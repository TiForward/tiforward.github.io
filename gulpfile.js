
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
var marked = require('marked');
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
  getArticles: getArticles,
  getArticle: getArticle,
  getArticleTranslations: getArticleTranslations,
  getLocaleArticles: getLocaleArticles,
  LOCALES: {
    'it-IT': 'Italiano',
    'en-US': 'English',
    'fr-FR': 'Français'
  }
};

var ARTICLES_CACHE = null;

function getArticles() {
  if (ARTICLES_CACHE) return ARTICLES_CACHE;
  return ARTICLES_CACHE =
  glob.sync('journal/**/*.md')
  .map(function (filepath) {
    return getArticle(filepath, path.resolve('journal'));
  })
  .sort(function (a, b) {
    return -(a.slug.localeCompare(b.slug));
  });
}

function getLocaleArticles(locale) {
  var articles = getArticles();
  var index = {};

  return articles.reduce(function (memo, article) {
    var group = index[ article.id ];
    var append = false;

    if (group == null) {
      append = true;
      group = index[ article.id ] = {
        id: article.id,
        translations: []
      };
    }

    if (article.locale === locale) {
      group.default = article;
    }
    else {
      group.translations.push(article);
    }

    return append ? memo.concat([ group ]) : memo;
  }, []);
}

function getArticleTranslations(translations, article) {
  if (translations.indexOf(article) < 0) {
    translations = translations.concat([ article ]);
  }

  return translations.sort(function (a, b) {
    return a.locale.localeCompare(b.locale);
  })
}

function getArticle(filepath, basepath, contents) {
  contents || (contents = fs.readFileSync(filepath, 'utf-8'));
  var matter = frontmatter(contents);
  var data = matter.attributes;
  var body = matter.body;

  data.id = getSlug(data.slug || path.relative(basepath, filepath));
  data.author = getPerson(data.author);
  data.translator = getPerson(data.translator);
  data.locale = data.locale || 'en-US';
  data.slug = getSlug(data.id, data.locale);
  data.body = marked(body);

  return data;
}

function getPerson(id) {
  if (!id) {
    return null;
  }

  var person = getJSON(path.resolve('journal/authors/', id + '.json'));

  person.id = id;

  return person;
}

function getJSON(filename) {
  return JSON.parse(fs.readFileSync(filename, 'utf-8'));
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

function getSlug(slug, locale) {
  var match = String(slug).match(slugRE);

  if (match) {
    slug = match.slice(1, 5).join('/');
  }

  if (locale && (locale !== 'en-US')) {
    slug = [ slug, locale ].join('/');
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
    .pipe(through(function (file) {
      var article = getArticle(file.path, file.base, file.contents.toString('utf-8'));

      var translations = null;

      getLocaleArticles(article.locale).forEach(function (group) {
        if (group.id === article.id) {
          translations = group.translations;
        }
      });

      var content = jade.renderFile('src/templates/journal_article.jade', {
        article: article,
        translations: translations,
        utils: jadeUtils
      });

      file.path = path.resolve(file.base, article.slug + '/index.html');
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
  ARTICLES_CACHE = null;
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
  gulp.watch('journal/**/*.json', ['html']);
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
