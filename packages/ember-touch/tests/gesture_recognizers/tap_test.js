// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set = Em.set;
var get = Em.get;

var view;
var application;
var translation;
var numEnded = 0;
var endCalled = false;

module("Tap Test",{
  setup: function() {
    numEnded = 0;
    endCalled = false;

    application = Em.Application.create();

    view = Em.View.create({
      elementId: 'gestureTest',

      tapEnd: function(recognizer) {
        endCalled = true;
      }
    });

    Em.run(function(){
      view.append();
    });
  },

  teardown: function() {

    var touchEvent = new jQuery.Event();
    touchEvent.type='touchend';
    touchEvent['originalEvent'] = {
      targetTouches: [],
      changedTouches: []
    };
    view.$().trigger(touchEvent)
    view.destroy();
    application.destroy();
  }
});

test("one start event should put it in began state", function() {
  var numStart = 0;
  var touchEvent = jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  var gestures = get(get(view, 'eventManager'), 'gestures');

  ok(gestures);
  equals(gestures.length,1);
  equals(get(gestures[0], 'state'),Em.Gesture.BEGAN, "gesture should be began");
});

test("when touch ends, tap should fire", function() {
  var numStart = 0;
  var touchEvent = new jQuery.Event();

  touchEvent.type='touchstart';
  touchEvent['originalEvent'] = {
    targetTouches: [{
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  var gestures = get(get(view, 'eventManager'), 'gestures');

  ok(gestures, "gestures should exist");
  equals(gestures.length,1);
  equals(get(gestures[0], 'state'),Em.Gesture.BEGAN, "gesture should be began");

  touchEvent = new jQuery.Event();
  touchEvent.type='touchend';
  touchEvent['originalEvent'] = {
    changedTouches: [{
      pageX: 5,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  gestures = get(get(view, 'eventManager'), 'gestures');

  ok(endCalled,'tap should be ended');
  ok(gestures, "gestures should exist");
  equals(gestures.length,1,"there should be one gesture");
  equals(get(gestures[0], 'state'),Em.Gesture.ENDED, "gesture should be ended");


});

