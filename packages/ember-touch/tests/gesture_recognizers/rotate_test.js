var set = Em.set;
var get = Em.get;

var view, View, change;
var application;
var numEnded = 0;

module('Rotate Test',{
  setup: function() {
    numEnded = 0;

    View = Em.View.extend({
      elementId: 'gestureTest',
      rotateStart: function(recognizer) {
        change = get(recognizer, 'deltaDegrees');

        return Math.abs(change) >= 45;
      },
      rotateChange: function(recognizer) {
        change = get(recognizer, 'deltaDegrees');

        return true;
      },
      rotateEnd: function(recognizer) {
        numEnded++;
        return true;
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
      changedTouches: []
    };
    view.$().trigger(touchEvent);

    Em.run(function(){
      view.destroy();
      application.destroy();
    });
  }
});

test('one start event should put it in waiting state', function() {
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

  ok(gestures);
  equal(gestures.length,1);
  equal(get(gestures[0], 'state'), Em.Gesture.WAITING_FOR_TOUCHES, 'gesture should be waiting');
});

test('two start events should put it in possible state', function() {
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
  equal(get(gestures[0], 'state'),Em.Gesture.POSSIBLE, 'gesture should be possible');
});

test('If the touches move, the rotation should reflect the change', function() {
  var touchEvent = new jQuery.Event();
  touchEvent.type='touchstart';
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 0
    },
    {
      identifier: 1,
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  var gestures = get(get(view, 'eventManager'), 'gestures');

  ok(gestures);
  equal(gestures.length,1);
  equal(get(gestures[0], 'state'),Em.Gesture.POSSIBLE, 'gesture should be possible');

  touchEvent = new jQuery.Event();
  touchEvent.type='touchmove';
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 1,
      pageX: 10,
      pageY: 0
    }]
  };

  view.$().trigger(touchEvent);

  gestures = get(get(view, 'eventManager'), 'gestures');
  equal(get(gestures[0], 'state'), Em.Gesture.BEGAN, 'gesture should be began');

  equal(get(gestures[0], 'rotationDegrees'), 90, 'rotation should be 90 degrees');
  equal(get(gestures[0], 'rotation'), Math.PI / 2, 'rotation should be 0.5 PI radians');
  equal(get(gestures[0], 'deltaDegrees'), 90, 'delta should be 90 degrees');
  equal(get(gestures[0], 'delta'), Math.PI / 2, 'delta should be 0.5 PI radians');

  touchEvent = new jQuery.Event();
  touchEvent.type='touchmove';
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 1,
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  gestures = get(get(view, 'eventManager'), 'gestures');
  equal(get(gestures[0], 'state'),Em.Gesture.CHANGED, 'gesture should be changed');

  equal(get(gestures[0], 'rotationDegrees'), 0, 'rotation should be back to 0 degrees');
  equal(get(gestures[0], 'rotation'), 0, 'rotation should be back to 0 radians');
  equal(get(gestures[0], 'deltaDegrees'), -90, 'delta should be -90 degrees');
  equal(get(gestures[0], 'delta'), -0.5 * Math.PI, 'delta should be -0.5 PI radians');

  touchEvent = new jQuery.Event();
  touchEvent.type='touchend';
  touchEvent['originalEvent'] = {
    changedTouches: [{ 
      identifier: 0,
      pageX: 10, 
      pageY: 20 
    }]
  };

  view.$().trigger(touchEvent);

  touchEvent = new jQuery.Event();
  touchEvent.type='touchend';
  touchEvent['originalEvent'] = {
    changedTouches: [{ 
      identifier: 1,
      pageX: 10, 
      pageY: 20 
    }]
  };

  view.$().trigger(touchEvent);

  gestures = get(get(view, 'eventManager'), 'gestures');
  equal(get(gestures[0], 'state'),Em.Gesture.ENDED, 'gesture should be ended');

  equal(numEnded, 1, 'rotateEnd should be called once');
});

test('If a gesture event returns false, reject the change', function() {
  var touchEvent = jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 0,
      pageY: 0
    },
    {
      identifier: 1,
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  var gestures = get(get(view, 'eventManager'), 'gestures');
  equal(get(gestures[0], 'rotationDegrees'), 0, 'start at zero');

  touchEvent = jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 1,
      pageX: 0.1,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  gestures = get(get(view, 'eventManager'), 'gestures');
  equal(get(gestures[0], 'rotationDegrees'), 0, 'rotation degrees should not change');
  equal(get(gestures[0], 'rotation'), 0, 'rotation radians should not change');
  equal(get(gestures[0], 'deltaDegrees'), 0, 'delta degrees should not change');
  equal(get(gestures[0], 'delta'), 0, 'delta radians should not change');
});
