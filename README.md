# Sproutcore/Ember Touch

## Overview
Sproutcore/Ember Touch lays the groundwork for a comprehensive touch and
gesture system that sits on top of [EmberJS](https://github.com/emberjs/ember.js).

Along with providing support for custom gesture recognizers, Ember
Touch ships with some pre-built gestures: Pinch, Pan, Tap, TouchHold and
Press.

Consult the [gesture.js](https://github.com/emberjs-addons/sproutcore-touch/blob/master/packages/ember-touch/lib/system/gesture.js) file for instructions on building your own gestures as well as using the built-in one.

# Usage

1.a) Rake command will build ember-touch.js on the dist folder in order to be used on your project.

1.b) Import the project to your Ember App and build it with your build tools ( ex: rake-pipeline ).

2. Add gesture support to your views just by adding specific methods (
   tapEnd, touchHoldStart, touchHoldEnd....)

3. Tests your views on multi touch devices or qunit.
   
# How to Run Unit Tests

run __bundle exec rackup__ 

Test the whole suite  http://localhost:9292/tests/index.html

Test only a specific test file (add test param: test location without extension) http://localhost:9292/tests/index.html?test=system/view_test

If you want to test against other ember.js version, deployed the js on its package directory.


# Questions

Wiki or open an issue
