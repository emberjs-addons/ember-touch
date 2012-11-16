var set = Em.set; 
var get = Em.get;
var application;

module("Em.View extensions", {
  setup: function() {

    application = Em.Application.create({
      ready: function() {

        var gestureManager = get(this, 'gestureManager');
        var gestures = get(gestureManager, 'registeredGestures');
        gestures.register('viewTestGesture', Em.Object.extend());
        start();
      }
    });
    stop();

  },

  teardown: function() {
    application.destroy();
  }  

});

test("should detect gesture", function() {

  var view = Em.View.create({
    viewTestGestureStart: function() {

    },
    viewTestGestureChange: function() {

    },
    viewTestGestureEnd: function() {

    },
    viewTestGestureCancel: function() {

    }
  });

  var eventManager = get(view, 'eventManager');
  ok(eventManager,'view has an eventManager');

  var gestures = get(eventManager, 'gestures');
  equal(gestures.length,1,'gesture exists');
});

test("should apply options", function() {

  var view = Em.View.create({
    viewTestGestureOptions: {
      numberOfRequiredTouches: 4
    },

    viewTestGestureStart: function() {

    }
  });

  var eventManager = get(view, 'eventManager');
  ok(eventManager,'view has an eventManager');

  var gestures = get(eventManager, 'gestures');
  equal(gestures.length,1,'gesture exists');

  equal(gestures[0].numberOfRequiredTouches,4, "should apply options hash");
});

test("A view without gestures have assigned a GestureManager at its eventManager property", function() {

  var view = Em.View.create({

  });

  var eventManager = get(view, 'eventManager');
  ok(eventManager,'view has an eventManager');

  var gestures = get(eventManager, 'gestures');
  equal(gestures.length,0,' has not gestures');

});
