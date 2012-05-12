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

/*
test("UNUSED/TODO: Nested event managers should get called appropriately", function() {
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
        equal(callNumber,0,'nested manager called first');
        callNumber++;
      },

      touchStart: function() {
        equal(callNumber,1,'nested view called second');
        callNumber++;
      }
    }),

    nestedEventManagerTestGestureStart: function() {
      equal(callNumber,2,'parent manager called third');
      callNumber++;
    },

    touchStart: function() {
      equal(callNumber,3,'parent view called fourth');
      callNumber++;
    }
  });

  Em.run(function(){
    view.append();
  });

  var gestures = get(get(view, 'eventManager'), 'gestures');

  ok(gestures);
  equal(gestures.length,1);

  $('#nestedTestView').trigger('touchstart');
  Em.Gestures.unregister('nestedViewTestGesture');
  Em.Gestures.unregister('nestedEventManagerTestGestureStart');
});
*/

