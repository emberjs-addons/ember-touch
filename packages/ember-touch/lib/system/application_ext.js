var set = Ember.set, get = Ember.get;

Em.Application.reopen({

  gestureManager: Ember.computed(function() {
    // TODO: more elegant way
    return this.__container__.lookup('gesture:application');
  })

});


Ember.Application.initializer({

  name: 'gestureManager',
  before: 'defaultGestures',

  initialize: function(container) {
    container.register('gesture:application', Ember.ApplicationGestureManager);
  }

});

Ember.Application.initializer({

  name: 'defaultGestures',
  after: 'gestureManager',

  initialize: function(container) {

    var gestureManager = container.lookup('gesture:application');

    gestureManager.registerGesture('pan', Em.PanGestureRecognizer);
    gestureManager.registerGesture('pinch', Em.PinchGestureRecognizer);
    gestureManager.registerGesture('press', Em.PressGestureRecognizer);
    gestureManager.registerGesture('swipe', Em.SwipeGestureRecognizer);
    gestureManager.registerGesture('tap', Em.TapGestureRecognizer);
    gestureManager.registerGesture('touchHold', Em.TouchHoldGestureRecognizer);

  }

});
