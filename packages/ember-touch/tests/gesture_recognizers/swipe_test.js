
var set = Em.set;
var get = Em.get;

var view;
var application;
var swipeThreshold = 10;
var cancelPeriod= 100;
var endCalled = false;
var cancelCalled = false;

module("Swipe Test",{
  setup: function() {
    endCalled = false;

    application = Em.Application.create();

    view = Em.View.create({

      swipeOptions: {
        direction: Em.OneGestureDirection.Right,
        cancelPeriod: cancelPeriod,
        swipeThreshold: swipeThreshold,
        simultaneously: true
      },

      swipeStart: function(recognizer) {

      },
      swipeChange: function(recognizer) {

      },
      swipeEnd: function(recognizer) {
        endCalled = true;
      },
      swipeCancel: function(recognizer) {
        cancelCalled = true;
      }

    });

    Em.run(function(){
      view.append();
    });
  },

  teardown: function() {

    cancelCalled = false;
    endCalled = false;
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

test(" Init: one start event should put it in possible state and when move the init threshold should put it in began state", function() {
  var touchEvent = jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  var gestures = get(get(view, 'eventManager'), 'gestures');

  ok(gestures);
  equals(gestures.length,1);
  equals(get(gestures[0], 'state'),Em.Gesture.POSSIBLE, "gesture should be possible");


  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  equals(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.BEGAN, "gesture should be BEGAN");


});


test(" After init when cancelPeriod is reached, cancel method is called", function() {
  var touchEvent = jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  equals(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.POSSIBLE, "gesture should be POSSIBLE");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  equals(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.BEGAN, "gesture should be BEGAN");


  stop();  
  
  setTimeout(function() {  

      var gestures = get(get(view, 'eventManager'), 'gestures');

      ok(cancelCalled,'cancel should be called');
      ok(gestures, "gestures should exist");
      equals(gestures.length,1,"there should be one gesture");
      equals(get(gestures[0], 'state'),Em.Gesture.CANCELLED, "gesture should be cancelled");

      start();  

  }, cancelPeriod + 100);

});

test("If touchend is fired before swipeThreshold is reached, cancel is called", function() {

  var touchEvent = jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);
  equals(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.POSSIBLE, "gesture should be POSSIBLE");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 10
    }]
  };
  view.$().trigger(touchEvent);
  equals(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.BEGAN, "gesture should be BEGAN");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10+swipeThreshold -1,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);
  equals(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.CHANGED, "gesture should be CHANGED");

  touchEvent = jQuery.Event('touchend');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 10+swipeThreshold -1,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  var gestures = get(get(view, 'eventManager'), 'gestures');

  ok(!endCalled,'endCalled should not be called');
  ok(cancelCalled,'cancel should be called');

  equals( get(gestures[0], 'state'), Em.Gesture.CANCELLED, "gesture should be cancelled");


});

test("swipeEnd is recognized when swipeThreshold is reached, and if after being the gesture recognized, touchend is fired, cancel routine is not executed.", function() {

  var touchEvent = jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);
  equals(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.POSSIBLE, "gesture should be POSSIBLE");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 10
    }]
  };
  view.$().trigger(touchEvent);
  equals(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.BEGAN, "gesture should be BEGAN");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10+swipeThreshold +1,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);
  equals(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.ENDED, "gesture should be ENDED");

  ok(endCalled,'endCalled should have been called');

  touchEvent = jQuery.Event('touchend');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 10+swipeThreshold+1,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  var gestures = get(get(view, 'eventManager'), 'gestures');

  equals(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.ENDED, "gesture should be ENDED");
  ok(!cancelCalled,'cancelCalled should not be called');

});

test("Recognizes multiple directions (Left and Right) ", function() {

  var touchEvent, isLeft, isRight;

  var view2 = Em.View.create({
    swipeOptions: {
      direction: Em.OneGestureDirection.Left | Em.OneGestureDirection.Right,
      cancelPeriod: cancelPeriod,
      swipeThreshold: swipeThreshold
    },
    swipeStart: function(recognizer) {
    },
    swipeChange: function(recognizer) {
    },
    swipeEnd: function(recognizer) {

      if ( recognizer.swipeDirection === Em.OneGestureDirection.Left )
        isLeft = true;

      if ( recognizer.swipeDirection === Em.OneGestureDirection.Right )
        isRight = true;

    },
    swipeCancel: function(recognizer) {
    }
  });

  Em.run(function(){
    view2.append();
  });


  isLeft = false;
  isRight = false;

  touchEvent = jQuery.Event('touchstart');

  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 10
    }]
  };
  view2.$().trigger(touchEvent);
  equals(get(get(get(view2, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.POSSIBLE, "gesture should be POSSIBLE");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 10
    }]
  };
  view2.$().trigger(touchEvent);
  equals(get(get(get(view2, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.BEGAN, "gesture should be BEGAN");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: -200,
      pageY: 10

    }]
  };

  view2.$().trigger(touchEvent);
  equals(get(get(get(view2, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.ENDED, "gesture should be ENDED");

  ok(isLeft,'recognizes left direction');
  ok(!isRight,'there was no swipe right');

  isLeft = false;
  isRight = false;


  touchEvent = jQuery.Event('touchstart');

  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 10
    }]
  };
  view2.$().trigger(touchEvent);
  equals(get(get(get(view2, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.POSSIBLE, "gesture should be POSSIBLE");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 10
    }]
  };
  view2.$().trigger(touchEvent);
  equals(get(get(get(view2, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.BEGAN, "gesture should be BEGAN");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 200,
      pageY: 10

    }]
  };

  view2.$().trigger(touchEvent);
  equals(get(get(get(view2, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.ENDED, "gesture should be ENDED");

  ok(isRight,'recognizes right direction');
  ok(!isLeft,'there was no swipe left');



});

test("Recognizes multiple directions (Up and Down) ", function() {

  var touchEvent, isUp, isDown;

  var view2 = Em.View.create({
    swipeOptions: {
      direction: Em.OneGestureDirection.Up | Em.OneGestureDirection.Down | Em.OneGestureDirection.Left | Em.OneGestureDirection.Right,

      cancelPeriod: cancelPeriod,
      swipeThreshold: swipeThreshold
    },
    swipeStart: function(recognizer) {
    },
    swipeChange: function(recognizer) {
    },
    swipeEnd: function(recognizer) {

      if ( recognizer.swipeDirection === Em.OneGestureDirection.Up )
        isUp = true;

      if ( recognizer.swipeDirection === Em.OneGestureDirection.Down )
        isDown = true;

    },
    swipeCancel: function(recognizer) {
    }
  });

  Em.run(function(){
    view2.append();
  });

  isUp = false;
  isDown = false;

  touchEvent = jQuery.Event('touchstart');

  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 0
    }]
  };
  view2.$().trigger(touchEvent);
  equals(get(get(get(view2, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.POSSIBLE, "gesture should be POSSIBLE");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 10
    }]
  };
  view2.$().trigger(touchEvent);
  equals(get(get(get(view2, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.BEGAN, "gesture should be BEGAN");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 100

    }]
  };

  view2.$().trigger(touchEvent);
  equals(get(get(get(view2, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.ENDED, "gesture should be ENDED");



  ok(isDown,'recognizes down direction');
  ok(!isUp,'there was no swipe up');


  isUp = false;
  isDown = false;


  touchEvent = jQuery.Event('touchstart');

  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 0
    }]
  };
  view2.$().trigger(touchEvent);
  equals(get(get(get(view2, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.POSSIBLE, "gesture should be POSSIBLE");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 10
    }]
  };
  view2.$().trigger(touchEvent);
  equals(get(get(get(view2, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.BEGAN, "gesture should be BEGAN");

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: -100

    }]
  };

  view2.$().trigger(touchEvent);
  equals(get(get(get(view2, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.ENDED, "gesture should be ENDED");

  ok(isUp,'recognizes up direction');
  ok(!isDown,'there was no swipe down');

});


