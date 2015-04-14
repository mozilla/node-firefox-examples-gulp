# node-firefox-examples-gulp

> An example for demonstrating how to build an app using npm modules + browserify + gulp

This is part of the [node-firefox](https://github.com/mozilla/node-firefox) project.

## What you need

- [node.js](http://nodejs.org) and [git](http://git-scm.com/) installed on your machine
- a Firefox OS simulator installed using [WebIDE](https://developer.mozilla.org/en-US/docs/Tools/WebIDE)
- the files of this demo (clone this repo or download [the zip](https://github.com/mozilla/node-firefox-examples-gulp/archive/master.zip))

## Build and run the example

Install the dependencies by running `npm install` in the directory of this project.

There are three npm scripts available:
- `npm start` will build the app into `build/index.html` which you can open with your browser to see it in action, unless you're using app APIs in which case you will need to run it in a Firefox OS simulator,
- `npm run default-one` will launch the first simulator it can find and push the app to it, launch it, and watch for CSS changes,
- `npm run default-all` will do the same but for all the simulators you have installed in your system.
