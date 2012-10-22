// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set = Em.set;
var get = Em.get;
var application = null;
var view;

module("Test Gesture Recognizer",{
  setup: function() {

    application = Em.Application.create({
      ready: function() {
        start();
      }
    });

    stop();

  },

  teardown: function() {
    if(view) view.destroy();
    application.destroy();
  }
});

test("gesturable views that implement pinch methods get a pinch recognizer", function() {

  var view = Em.View.create({
    pinchStart: function(evt) {

    },
    pinchChange: function(evt) {

    },
    pinchEnd: function(evt) {

    }
  });

  var gestures = get(get(view, 'eventManager'), 'gestures');

  ok(gestures,'Should have a gestures property');
  equal(gestures.length,1,'Should have one gesture');
  ok(gestures[0] instanceof Em.PinchGestureRecognizer,'gesture should be pinch');
});

test("when finger touches inside, gesture should be in waiting state", function() {
  var numStart = 0;
  view = Em.View.create({
    elementId: 'gestureTest',

    pinchStart: function(evt) {
      //numStart++;
    }

  });

  Em.run(function(){
    view.append();
  });

  var touchEvent = new jQuery.Event();

  touchEvent.type='touchstart';
  touchEvent['originalEvent'] = {
    targetTouches: [{
        pageX: 0,
        pageY: 0
    }]
  };

  view.$().trigger(touchEvent);

  var gestures = get(get(view, 'eventManager'), 'gestures');

  ok(gestures);
  equal(gestures.length,1);
  equal(get(gestures[0], 'state'),Em.Gesture.WAITING_FOR_TOUCHES, "gesture should be waiting");

  view.$().trigger('touchend');
});

test("when 2 fingers touch inside, gesture should be in possible state", function() {
  var numStart = 0;
  view = Em.View.create({
    elementId: 'gestureTest',

    pinchStart: function(evt) {
      numStart++;
    },

    touchStart: function(evt) {
      numStart++;
    }
  });

  Em.run(function(){
    view.append();
  });

  var touchEvent = new jQuery.Event();

  touchEvent.type='touchstart';
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 10
    },
    {
      identifier: 1,
      pageX: 10,
      pageY: 10
    }]
  };
  view.$().trigger(touchEvent);

  var gestures = get(get(view, 'eventManager'), 'gestures');
  window.gestures = gestures;

  ok(gestures);
  equal(gestures.length,1);
  equal(get(gestures[0], 'state'),Em.Gesture.POSSIBLE, "gesture should be possible");

  view.$().trigger('touchend');
});

test("when 2 fingers move closer together, gesture should be in BEGAN state", function() {
  var numStart = 0, numChange = 0,startScale, changeScale;
  view = Em.View.create({
    elementId: 'gestureTest',

    pinchStart: function(recognizer) {
      numStart++;
      startScale = get(recognizer, 'scale');
    },

    pinchChange: function(recognizer) {
      numChange++;
      changeScale = get(recognizer, 'scale');
    }

  });

  Em.run(function(){
    view.append();
  });

  // =====================================
  // Start

  var touchEvent = new jQuery.Event();

  touchEvent.type='touchstart';
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 50,
      pageY: 100
    },
    {
      identifier: 1,
      pageX: 100,
      pageY: 100
    }]
  };
  view.$().trigger(touchEvent);

  var gestures = get(get(view, 'eventManager'), 'gestures');
  window.gestures = gestures;

  ok(gestures);
  equal(gestures.length,1);
  equal(get(gestures[0], 'state'),Em.Gesture.POSSIBLE, "gesture should be possible");

  // =====================================
  // Double its size

  touchEvent = new jQuery.Event();

  touchEvent.type='touchmove';
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 100
    }]
  };

  view.$().trigger(touchEvent);

  equal(get(gestures[0], 'state'),Em.Gesture.BEGAN, "gesture should be began");
  equal(numStart,1,"pinchStart called once");
  equal(startScale,2,"scale should be doubled");

  // =====================================
  // Halve its size

  touchEvent = new jQuery.Event();
  touchEvent.type='touchmove';
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 50,
      pageY: 100
    }]
  };

  view.$().trigger(touchEvent);

  equal(changeScale,0.5,"scale should be halved");

  // =====================================
  // End gesture

  touchEvent = new jQuery.Event();
  touchEvent.type='touchend';
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 50,
      pageY: 100
    }]
  };
  view.$().trigger(touchEvent);

  equal(get(gestures[0], 'state'),Em.Gesture.ENDED, "gesture should be ended");

  // =====================================
  // Start again

  numStart = 0;

  touchEvent = new jQuery.Event();
  touchEvent.type='touchstart';
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 50,
      pageY: 100
    },
    {
      identifier: 1,
      pageX: 100,
      pageY: 100
    }]
  };

  view.$().trigger(touchEvent);

  touchEvent = new jQuery.Event();
  touchEvent.type='touchmove';
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 100
    }]
  };

  view.$().trigger(touchEvent);

  equal(numStart,1,"pinchStart called once");
  equal(get(gestures[0], 'state'),Em.Gesture.BEGAN, "gesture should be began");
  equal(startScale,2,"scale should be doubled again");

  // =====================================
  // Half its size

  touchEvent = new jQuery.Event();
  touchEvent.type='touchmove';
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 50,
      pageY: 100
    }]
  };

  view.$().trigger(touchEvent);

  equal(get(gestures[0], 'state'),Em.Gesture.CHANGED, "gesture should be changed");
  equal(changeScale,0.5,"scale should be halved");

});

