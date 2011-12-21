# Ember Touch

## Overview
Ember Touch lays the groundwork for a comprehensive touch and
gesture system that sits on top of [EmberJS](github.com/emberjs/ember.js).

Along with providing support for custom gesture recognizers, Ember
Touch ships with some pre-built gestures: Pinch, Pan, Tap, TouchHold and
Press.

Consult the gesture.js file for instructions on building your own gestures as well
as using the built-in one.

Touch ember views can also be used with other UI, libraries (ex: iScroll 4 ) which also handles touch events.

# TODO

1. More testing and improvements.

# Usage

1. Rake command will build ember-touch.js on the dist folder in order to be used on your project.

2. Add gesture support to your views just by adding specific methods (
   tapEnd, touchHoldStart, touchHoldEnd....)

3. Tests your views on multi touch devices or testing with jqunit.
   
# How to Run Unit Tests

1. Install Ruby 1.9.2. There are many resources on the web can help; one of the best is [rvm](http://rvm.beginrescueend.com/).

3. Run `gem install bpm --pre` to install bpm, the browser package
   manager.

4. To start the development server, run `bpm preview`

5. Then visit: `http://localhost:4020/assets/spade-qunit/index.html?package=sproutcore-touch`
