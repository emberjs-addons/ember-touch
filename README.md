# Sproutcore/Ember Touch

[![Build Status](https://secure.travis-ci.org/emberjs-addons/sproutcore-touch.png)](http://travis-ci.org/emberjs-addons/sproutcore-touch)

## Overview
Sproutcore/Ember Touch lays the groundwork for a comprehensive touch and
gesture system that sits on top of [EmberJS](https://github.com/emberjs/ember.js).

Along with providing support for custom gesture recognizers, Ember
Touch ships with some pre-built gestures: Pinch, Pan, Tap, TouchHold and
Press.

Consult the [gesture.js](https://github.com/emberjs-addons/sproutcore-touch/blob/master/packages/ember-touch/lib/system/gesture.js) file for instructions on building your own gestures as well as using the built-in one.

# Usage

1. Import the project.

  - You can execute _rake dist_ command to build ember-touch.js in the dist folder to be imported.

  - Or clone the project to your Ember App and use your build tools ( ex: rake-pipeline ).

2. Add gesture support to your views just by adding specific methods (
   tapEnd, touchHoldStart, touchHoldEnd....)

3. Tests your views on multi touch devices or qunit.
   
## Unit Tests

You can run your tests against multiple Ember Versions:

  - 0.9.8.1 ( default )
  - 1.0.pre


Run the server: _bundle exec rackup_

To run/check the unit test output, open: 

  `http://localhost:9292/tests/index.html?package=ember-touch`

  `http://localhost:9292/tests/index.html?package=ember-touch&ember=1.0.pre`

# Info

Look at the current [Wiki](https://github.com/emberjs-addons/sproutcore-touch).

# Questions, bugs

Please, open an issue.
