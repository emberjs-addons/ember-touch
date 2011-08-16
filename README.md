# SproutCore Touch

**Current Version:** 2.0.beta

## Overview
SproutCore Touch lays the groundwork for a comprehensive touch and
gesture system that sits on top of [SproutCore 2.0](github.com/sproutcore/sproutcore20).

Along with providing support for custom gesture recognizers, SproutCore
Touch ships with some pre-built gestures: Pinch, Pan, and Tap.

Consult the gesture.js file for instructions on building your own gestures as well
as using the built-in one.

# Usage

1. Download the [SproutCore Touch Starter Kit](https://github.com/sproutcore/sproutcore-touch/downloads)

2. Unzip and open the kit in your favourite editor

3. Open the iOS Simulator and try pinching and panning the red box with two fingers

4. Open js/app.js and play around with the application. You can find docs in [gesture.js](https://github.com/sproutcore/sproutcore-touch/blob/master/packages/sproutcore-touch/lib/system/gesture.js)
   
# How to Run Unit Tests

1. Install Ruby 1.9.2. There are many resources on the web can help; one of the best is [rvm](http://rvm.beginrescueend.com/).

3. Run `gem install bpm --pre` to install bpm, the browser package
   manager.

4. To start the development server, run `bpm preview`

5. Then visit: `http://localhost:4020/assets/spade-qunit/index.html?package=sproutcore-touch`