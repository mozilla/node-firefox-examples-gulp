'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var yargs = require('yargs');
var path = require('path');
var fs = require('fs');

var findSimulators = require('node-firefox-find-simulators');
var startSimulator = require('node-firefox-start-simulator');
var connect = require('node-firefox-connect');
var findApp = require('node-firefox-find-app');
var installApp = require('node-firefox-install-app');
var uninstallApp = require('node-firefox-uninstall-app');
var launchApp = require('node-firefox-launch-app');
var reloadCSS = require('node-firefox-reload-css');
var Promise = require('es6-promise').Promise;

var appPath = path.join(__dirname, 'build');

var activeRuntimes = [];

gulp.task('lint', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('build', ['build-manifest', 'build-js', 'build-html', 'build-css']);

gulp.task('build-manifest', function() {
  return gulp.src('src/manifest.webapp')
  .pipe(gulp.dest('./build/'));
});

gulp.task('build-js', function() {
  return gulp.src('src/js/main.js')
    .pipe(browserify({
      insertGlobals: false,
      debug: !yargs.argv.production
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('build-html', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('./build/'));
});

gulp.task('build-css', function() {
  return gulp.src('src/css/style.css')
    .pipe(gulp.dest('./build/css'));
});

gulp.task('simulate-one', function() {
  simulate(appPath).then(function(results) {
    activeRuntimes.push(results);
  });
});

gulp.task('simulate-all', function() {
  return findSimulators().then(function(results) {
    return Promise.all(results.map(function(simulator) {
      return simulate(appPath, {
        version: simulator.version
      }).then(function(results) {
        activeRuntimes.push(results);
      });
    }));
  });
});

gulp.task('reload-css', function() {
  console.log('going to reload', activeRuntimes.length);
  activeRuntimes.forEach(function(runtime) {
    reloadCSS({
      app: runtime.app,
      client: runtime.client,
      srcPath: appPath
    });
  });
});

gulp.task('watch-css', function() {
  gulp.watch('src/**/*.css', ['build', 'reload-css']);
});

gulp.task('default-one', ['lint', 'build', 'simulate-one', 'watch-css']);

gulp.task('default-all', ['lint', 'build', 'simulate-all', 'watch-css']);

gulp.task('default', ['default-one']);

function simulate(appPath, simulatorDef) {
  var client;
  var simulator;
  
  return startAndConnect(simulatorDef).then(function(results) {
    client = results.client;
    simulator = results.simulator;
    return pushApp(client, appPath);
  }).then(function(app) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        launchApp({
          client: client,
          manifestURL: app.manifestURL
        }).then(function(res) {
          resolve({
            client: client,
            app: app,
            simulator: simulator
          });
        });
      }, 500);
    });
  });
}


function startAndConnect(def) {
	return startSimulator(def).then(function(simulator) {
    return connect(simulator.port).then(function(client) {
      return ({
        simulator: simulator,
        client: client
      });
    });
  });
}

function loadJSON(path) {
  var data = fs.readFileSync(path, 'utf8');
  return JSON.parse(data);
}

function pushApp(client, appPath) {
  var manifestPath = path.join(appPath, 'manifest.webapp');
  var manifest = loadJSON(manifestPath);
  
  return findApp({
    client: client,
    manifest: manifest
  }).then(function(apps) {
    return uninstallApps(client, apps);
  }).then(function() {
    return installApp({
      client: client,
      appPath: appPath
    });
  }).then(function() {
    return findApp({
      client: client,
      manifest: manifest
    }).then(function(apps) {
      return apps[0];
    });
  });

}

function uninstallApps(client, apps) {
  return Promise.all(apps.map(function(app) {
    return uninstallApp({
      client: client,
      manifestURL: app.manifestURL
    });
  }));
}



