
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
    name: "touch",

    injection: function(app, stateManager, property) {
      // TODO: registerInjection get fired twice

      if ( !!app.get('gestureManager') ) { return; }

      var currentManager = Em.applicationGestureManager;
      if ( !!currentManager ) {
        Em.assert('Either you create multiple Application instances or you forgot to destroy it', currentManager.get('isDestroyed') );
      }
      var manager = Em.ApplicationGestureManager.create({});
      Em.applicationGestureManager = manager;
      set(app, 'gestureManager', manager);

    }
  });

});
