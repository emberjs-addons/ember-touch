var set = Em.set;
var get = Em.get;

module("Em.View extensions", {
  setup: function() {
    Em.Gestures.register('viewTestGesture',Em.Object.extend());
  },

  teardown: function() {
    Em.Gestures.unregister('viewTestGesture');
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
