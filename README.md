# Sproutcore/Ember Touch

[![Build Status](https://secure.travis-ci.org/emberjs-addons/ember-touch.png)](http://travis-ci.org/emberjs-addons/ember-touch)

## Overview

Ember Touch lays the groundwork for a comprehensive touch and
gesture system that sits on top of [EmberJS](https://github.com/emberjs/ember.js).

Along with providing support for custom gesture recognizers, Ember
Touch ships with some pre-built gestures: Pinch, Pan, Tap, TouchHold and
Press.

# Usage

1. Import the project.

  - You can execute _rake dist_ command to build ember-touch.js in the dist folder to be imported.

  - Or clone the project to your Ember App and use your build tools ( ex: rake-pipeline ).

2. Add gesture support to your views just by adding specific methods (
   tapEnd, touchHoldStart, touchHoldEnd....)

3. Tests your views on multi touch devices or qunit.
   
## Unit Tests

Run the server: _bundle exec rackup_

To run/check the unit test output, open: 

  `http://localhost:9292/tests/index.html?package=ember-touch`

# Info

Look at the current [Wiki](https://github.com/emberjs-addons/sproutcore-touch).

Docs can be generated: 

  - _rake generate_docs_ 
  - Access ./docs/build/index.html

# Questions, bugs

Please, open an issue.
