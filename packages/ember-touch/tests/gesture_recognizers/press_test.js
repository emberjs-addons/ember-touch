
var set = Em.set;
var get = Em.get;

var view;
var application;
var periodThreshold = 200;
var endCalled = false;

module("Press Test",{
  setup: function() {
    endCalled = false;

    application = Em.Application.create();

    view = Em.View.create({
      
      elementId: 'gestureTest',

      pressOptions: {
        pressPeriodThreshold: periodThreshold
      },

      pressEnd: function(recognizer) {
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

test("when touch ends, touchpressEnd should fire", function() {

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

  stop();  
  
  setTimeout(function() {  

      touchEvent = new jQuery.Event();
      touchEvent.type='touchend';
      touchEvent['originalEvent'] = {
        changedTouches: [{
          pageX: 0,
          pageY: 10
        }]
      };

      view.$().trigger(touchEvent);

      gestures = get(get(view, 'eventManager'), 'gestures');

      ok(endCalled,'touch press should be ended');
      ok(gestures, "gestures should exist");
      equals(gestures.length,1,"there should be one gesture");
      equals(get(gestures[0], 'state'),Em.Gesture.ENDED, "gesture should be ended");

      start();  

  }, periodThreshold);

});


test("when touch ends before pressPeriodThreshold, touchpressEnd should not fire and cancelled state", function() {

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
      pageX: 0,
      pageY: 10
    }]
  };

  view.$().trigger(touchEvent);

  gestures = get(get(view, 'eventManager'), 'gestures');

  ok(!endCalled,'touch press should not be ended');
  ok(gestures, "gestures should exist");
  equals(gestures.length,1,"there should be one gesture");
  equals(get(gestures[0], 'state'),Em.Gesture.CANCELLED, "gesture should be ended");


});
