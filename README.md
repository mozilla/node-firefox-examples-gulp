# node-firefox-examples-gulp

> An example for demonstrating how to build an app using npm modules + browserify + gulp

This is part of the [node-firefox](https://github.com/mozilla/node-firefox) project.

## Getting it

### Clone it

`git clone https://github.com/mozilla/node-firefox-examples-gulp.git`

### Or download

[the zip](https://github.com/mozilla/node-firefox-examples-gulp/archive/master.zip)

## Initialising

Install node.js if not installed yet, then cd to the directory and run `npm init`.

To build the files into the `build` folder just do `npm start`. This will build the app into `build/index.html` which you can open with your browser to see it in action, unless you're using app APIs in which case you will need to run it in a Firefox OS simulator. There are two other gulp tasks available, `npm default-one` will launch the first simulator it can find and push the app to it, launch it, and watch for CSS changes. `npm default-all` will do the same but for all the simulators you have installed in your system.

