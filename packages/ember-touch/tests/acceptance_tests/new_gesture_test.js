var set = Em.set; 
var get = Em.get;
var view;
var application;
var oldInitializers, locator, lookup;

module("New gestures", {
  setup: function() {

   Em.run(function() {
      application = Em.Application.create({
        ready: function() {

          Ember.Container.defaultContainer = this.__container__;

          // Enable new gestures with application initializer
          var applicationGestureManager = this.get('gestureManager');
          applicationGestureManager.registerGesture('newGesture', Em.Object.extend() );
          start();
        }
      });
      stop();
   });


  },

  teardown: function() {
    

    Em.run(function() {

      var applicationGestureManager = application.get('gestureManager');
      applicationGestureManager.unregisterGesture('newGesture');
      application.destroy();

    });

  }  

});

test("should detect gesture", function() {


  view = Em.View.create({
    newGestureStart: function() {

    },
    newGestureChange: function() {

    },
    newGestureEnd: function() {

    },
    newGestureCancel: function() {

    }
  });

  var eventManager = get(view, 'eventManager');
  ok(eventManager,'view has an eventManager');

  var gestures = get(eventManager, 'gestures');
  equal(gestures.length,1,'gesture exists');
});

test("should apply options", function() {


  view = Em.View.create({

    newGestureOptions: {
      numberOfRequiredTouches: 4
    },

    newGestureStart: function() {

    }
  });

  var eventManager = get(view, 'eventManager');
  ok(eventManager,'view has an eventManager');

  var gestures = get(eventManager, 'gestures');
  equal(gestures.length,1,'gesture exists');
  var gesture = gestures[0];
  equal(gesture.numberOfRequiredTouches,4, "should apply options hash");

});

test("A view without gestures have assigned a GestureManager at its eventManager property", function() {

  view = Em.View.create({

  });

  var eventManager = get(view, 'eventManager');
  ok(eventManager,'view has an eventManager');

  var gestures = get(eventManager, 'gestures');
  equal(gestures.length,0,' has not gestures');

});
