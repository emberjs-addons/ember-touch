# Sproutcore/Ember Touch

## Overview
Sproutcore/Ember Touch lays the groundwork for a comprehensive touch and
gesture system that sits on top of [EmberJS](https://github.com/emberjs/ember.js).

Along with providing support for custom gesture recognizers, Ember
Touch ships with some pre-built gestures: Pinch, Pan, Tap, TouchHold and
Press.

Consult the [gesture.js](https://github.com/emberjs-addons/sproutcore-touch/blob/master/packages/ember-touch/lib/system/gesture.js) file for instructions on building your own gestures as well as using the built-in one.

# Usage

1. Import the project.

  - Rake command will build ember-touch.js on the dist folder in order to be used on your project.
  - Or copy the project to your Ember App and use your build tools ( ex: rake-pipeline ).

2. Add gesture support to your views just by adding specific methods (
   tapEnd, touchHoldStart, touchHoldEnd....)

3. Tests your views on multi touch devices or qunit.
   
## Unit Tests

To run unit tests, run `bundle exec rackup` from the root directory and visit
`http://localhost:9292/tests/index.html?package=ember-touch`.


# Info

Look at the current [Wiki](https://github.com/emberjs-addons/sproutcore-touch).

# Questions, bugs

Please, open an issue.
