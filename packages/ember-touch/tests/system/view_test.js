// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

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
  equals(gestures.length,1,'gesture exists');
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
  equals(gestures.length,1,'gesture exists');

  equals(gestures[0].numberOfRequiredTouches,4, "should apply options hash");
});
