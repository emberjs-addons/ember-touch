var set = Em.set;
var get = Em.get;

var view, View, change;
var application;
var translation;
var numEnded = 0;

module("Pan Test",{
  setup: function() {
    numEnded = 0;


    View = Em.View.extend({
      elementId: 'gestureTest',

      panStart: function(recognizer) {
        change = get(recognizer, 'translation');
        if (change.x > 10) return false;
        translation = change;
      },

      panChange: function(recognizer) {
        change = get(recognizer, 'translation');
        if (change.x > 10) return false;
        translation = change;
      },

      panEnd: function(recognizer) {
        numEnded++;
      }
    });

    Em.run(function(){
      application = Em.Application.create({
        ready: function() {
          view = View.create();
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
      targetTouches: []
    };
    view.$().trigger(touchEvent);

    Em.run(function(){
      view.destroy();
      application.destroy();
    });
  }
});

test("one start event should put it in waiting state", function() {
  var numStart = 0;
  var touchEvent = new jQuery.Event();

  touchEvent.type='touchstart';
  touchEvent['originalEvent'] = {
    targetTouches: []
  };

  view.$().trigger(touchEvent);

  var gestures = get(get(view, 'eventManager'), 'gestures');

  ok(gestures);
  equal(gestures.length,1);
  equal(get(gestures[0], 'state'),Em.Gesture.WAITING_FOR_TOUCHES, "gesture should be waiting");
});

test("two start events should put it in possible state", function() {
  var numStart = 0;
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

  ok(gestures);
  equal(gestures.length,1);
  equal(get(gestures[0], 'state'),Em.Gesture.POSSIBLE, "gesture should be possible");
});

test("If the touches move, the translation should reflect the change", function() {
  var touchEvent = new jQuery.Event();
  touchEvent.type='touchstart';
  touchEvent['originalEvent'] = {
    targetTouches: [ {
      identifier: 0,
      pageX: 0,
      pageY: 10
    },
    {
      identifier: 1,
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);
  equal(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.POSSIBLE, "gesture should be possible");

  touchEvent = new jQuery.Event();
  touchEvent.type='touchmove';
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 5,
      pageY: 10
    },
    {
      identifier: 1,
      pageX: 5,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  equal(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.BEGAN, "gesture should be BEGAN");

  equal(translation.x,5,'changed x value');

  touchEvent = new jQuery.Event();
  touchEvent.type='touchmove';
  touchEvent['originalEvent'] = {
    changedTouches: [ {
      identifier: 0,
      pageX: 10,
      pageY: 15
    },
    {
      identifier: 1,
      pageX: 10,
      pageY: 15
    }]
  };

  view.$().trigger(touchEvent);
  equal(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.CHANGED, "gesture should be CHANGED");

  equal(translation.y,5,'changed y value');

  touchEvent = new jQuery.Event();
  touchEvent.type='touchend';
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 20
    }]
  };

  view.$().trigger(touchEvent);
  equal(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.ENDED, "gesture should be ENDED");

  touchEvent = new jQuery.Event();
  touchEvent.type='touchend';
  touchEvent['originalEvent'] = {
    targetTouches: []
  };

  view.$().trigger(touchEvent);
  equal(get(get(get(view, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.ENDED, "gesture should be ENDED");

  equal(numEnded,1,"panEnd should be called once");
});

test("If a gesture event returns false, reject the change", function() {
  var touchEvent = jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 10
    },
    {
      identifier: 1,
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 11,
      pageY: 10
    },
    {
      identifier: 1,
      pageX: 11,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  var gestures = get(get(view, 'eventManager'), 'gestures');
  equal(get(gestures[0], 'translation').x,0, "state should not change");
  equal(get(gestures[0], 'translation').y,0, "state should not change");
});

test("Subsequent pan gestures should be relative to previous ones", function() {


  // ======================================
  // START
  //
  var touchEvent = jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 10
    },
    {
      identifier: 1,
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);


  // ======================================
  // MOVE TO THE RIGHT 5px
  //
  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 5,
      pageY: 10
    },
    {
      identifier: 1,
      pageX: 5,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  equal(translation.x,5,'changed x value');
  equal(translation.y,0,'changed y value');


  // ======================================
  // END
  //
  touchEvent = new jQuery.Event();
  touchEvent.type='touchend';
  touchEvent['originalEvent'] = {
    targetTouches: []
  };

  view.$().trigger(touchEvent);

  // ======================================
  // START AGAIN
  //
  touchEvent = jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 10
    },
    {
      identifier: 1,
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  // ======================================
  // MOVE TO THE RIGHT ANOTHER 5px
  //

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 5,
      pageY: 10
    },
    {
      identifier: 1,
      pageX: 5,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  equal(translation.x,5,'changed x value');
  equal(translation.y,0,'changed y value');

});
