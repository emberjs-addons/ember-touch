# Ember Touch

## Overview
Ember Touch lays the groundwork for a comprehensive touch and
gesture system that sits on top of [EmberJS](https://github.com/emberjs/ember.js).

Along with providing support for custom gesture recognizers, Ember
Touch ships with some pre-built gestures: Pinch, Pan, Tap, TouchHold and
Press.

Consult the gesture.js file for instructions on building your own gestures as well as using the built-in one.

Touch ember views can also be used with other UI libraries (ex: iScroll 4 ) which also handles touch events.

# TODO

Test gestures on multiple touch devices.

Improvements, issues, bugs, contributions.....

# Wiki

[Read Sproutcore-Touch Wiki](https://github.com/emberjs-addons/sproutcore-touch/wiki/Documentation)


# Usage

1. Rake command will build ember-touch.js on the dist folder in order to be used on your project.

2. Add gesture support to your views just by adding specific methods (
   tapEnd, touchHoldStart, touchHoldEnd....)

3. Tests your views on multi touch devices or qunit.
   
# How to Run Unit Tests

run __bundle exec rackup__ 

Test the whole suite  http://localhost:9292/tests/index.html

Test only a specific test file (add test param: test location without extension) http://localhost:9292/tests/index.html?test=system/view_test

If you want to test against other ember.js version, deployed the js on its package directory.

