// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set = Em.set;
var get = Em.get;
var application;

module("Nested event managers", {
  setup: function() {
    application = Em.Application.create();
  },

  teardown: function() {
    application.destroy();
  }
});

test("UNUSED: Nested event managers should get called appropriately", function() {
/*
  Em.Gestures.register('nestedEventManagerTestGesture',Em.Gesture.extend({
    touchStart: function(evt, view, manager) {
      this.notifyViewOfGestureEvent(view, 'nestedEventManagerTestGestureStart');
      manager.redispatchEventToView(view,'touchstart');
    }
  }));

  Em.Gestures.register('nestedViewTestGesture',Em.Gesture.extend({
    touchStart: function(evt, view, manager) {
      this.notifyViewOfGestureEvent(view, 'nestedViewTestGestureStart');
      manager.redispatchEventToView(view,'touchstart');
    }
  }));

  var callNumber = 0;

  var view = Em.ContainerView.create({

    childViews: ['nestedView'],

    nestedView: Em.View.extend({
      elementId: 'nestedTestView',

      nestedViewTestGestureStart: function() {
        equals(callNumber,0,'nested manager called first');
        callNumber++;
      },

      touchStart: function() {
        equals(callNumber,1,'nested view called second');
        callNumber++;
      }
    }),

    nestedEventManagerTestGestureStart: function() {
      equals(callNumber,2,'parent manager called third');
      callNumber++;
    },

    touchStart: function() {
      equals(callNumber,3,'parent view called fourth');
      callNumber++;
    }
  });

  Em.run(function(){
    view.append();
  });

  var gestures = get(get(view, 'eventManager'), 'gestures');

  ok(gestures);
  equals(gestures.length,1);

  $('#nestedTestView').trigger('touchstart');
  Em.Gestures.unregister('nestedViewTestGesture');
  Em.Gestures.unregister('nestedEventManagerTestGestureStart');
*/
});

