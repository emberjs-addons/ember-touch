
var set = Ember.set, get = Ember.get;


Em.Application.reopen({

  willDestroy: function() {
    this._super();

    var manager = get(this, 'gestureManager');
    manager.destroy();

  }

});

Ember.onLoad('Ember.Application', function(Application) {

  Application.registerInjection({
    name: 'createGestureManager',

    injection: function(app, stateManager, property) {

      if ( !!app.get('gestureManager') ) { return; }

      // This can be improved if a view instance could access its
      // Application instance scope
      var currentManager = Em.applicationGestureManager;
      if ( !!currentManager ) {
        Em.assert('Either you create multiple Application instances or you forgot to destroy it', currentManager.get('isDestroyed') );
      }

      var gestureManager = Em.ApplicationGestureManager.create(),
          delegates = Em.GestureDelegates.create();

      set(gestureManager, 'delegates', delegates);
      
      Em.applicationGestureManager = gestureManager;
      set(app, 'gestureManager', gestureManager);

    }
  });

  Application.registerInjection({
    name: 'registerGestures',
    after: ['createGestureManager'],

    injection: function(app, stateManager, property) {

      if (property === 'gestureManager' ) {

        var gestures = Em.RegisteredGestures.create({});
        gestures.register('pan', Em.PanGestureRecognizer);
        gestures.register('pinch', Em.PinchGestureRecognizer);
        gestures.register('press', Em.PressGestureRecognizer);
        gestures.register('swipe', Em.SwipeGestureRecognizer);
        gestures.register('tap', Em.TapGestureRecognizer);
        gestures.register('touchHold', Em.TouchHoldGestureRecognizer);

        var gestureManager = get(app, 'gestureManager');
        set(gestureManager, 'registeredGestures', gestures);
      }

    }

  });

});
