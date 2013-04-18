var set = Em.set;
var get = Em.get;

var view, View;
var application;
var translation;
var numEnded = 0;
var endCalled = false;

module("Tap Test",{
  setup: function() {
    numEnded = 0;
    endCalled = false;


    View = Em.View.extend({
      elementId: 'gestureTest',

      tapEnd: function(recognizer) {
        endCalled = true;
      }
    });

    Em.run(function(){

      application = Em.Application.create({
        ready: function() {
          view = View.create({});
          view.append();
          start();
        }
      });
      stop();
    });
  },

  teardown: function() {

    var touchEvent = new jQuery.Event();
    touchEvent.type='touchend';
    touchEvent['originalEvent'] = {
      targetTouches: [],
      changedTouches: []
    };
    view.$().trigger(touchEvent);

    Em.run(function(){
      view.destroy();
      application.destroy();
    });
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
  equal(gestures.length,1);
  equal(get(gestures[0], 'state'),Em.Gesture.BEGAN, "gesture should be began");
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
  equal(gestures.length,1);
  equal(get(gestures[0], 'state'),Em.Gesture.BEGAN, "gesture should be began");

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
  equal(gestures.length,1,"there should be one gesture");
  equal(get(gestures[0], 'state'),Em.Gesture.ENDED, "gesture should be ended");


});

test("accepts multiple numberOfTaps", function() {

  var gestures;
  var touchEvent;
  var wasCalled = false;
  var view2 = Em.View.create({

    tapOptions: {
      numberOfTaps: 2,
      delayBetweenTaps: 1000
    },

    tapEnd: function(recognizer) {
      wasCalled = true;
    }

  });

  Em.run(function(){
    view2.append();
  });

  touchEvent = new jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      pageX: 0,
      pageY: 10
    }]
  };
  view2.$().trigger(touchEvent);


  gestures = get(get(view2, 'eventManager'), 'gestures');
  equal(get(gestures[0], 'state'),Em.Gesture.BEGAN, "gesture should be began");

  touchEvent = new jQuery.Event('touchend');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      pageX: 0,
      pageY: 10
    }]
  };
  view2.$().trigger(touchEvent);

  gestures = get(get(view2, 'eventManager'), 'gestures');
  equal(get(gestures[0], 'state'),Em.Gesture.BEGAN, "gesture should be began");

  ok(!wasCalled,'tap was not ended');


  touchEvent = new jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      pageX: 0,
      pageY: 10
    }]
  };
  view2.$().trigger(touchEvent);

  touchEvent = new jQuery.Event('touchend');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      pageX: 0,
      pageY: 10
    }]
  };
  view2.$().trigger(touchEvent);

  ok(wasCalled,'tap was called');


});

