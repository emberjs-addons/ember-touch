var get = Em.get, set = Em.set;

/*
  Extends Em.View making the init method gesture-aware.
*/
Em.View.reopen({

  /**
    The Em.GestureManager instance which will manage the gestures of the view.
    This object is automatically created and set at init-time.

    @default null
    @type Array
  */
  eventManager: null,

  init: function() {
    this._super();
    this._createGestureManager();
    
  },

  /**
    Inspects the properties on the view instance and create gestures if they're
    used.
  */
  _createGestureManager: function() {
    
    var eventManager = get(this, 'eventManager');

    if (!eventManager) {

      var applicationGestureManager = get(this, 'container').lookup('gesture:application');
      var knownGestures = applicationGestureManager.knownGestures();


      var gestures = [];
      var manager = Em.GestureManager.create();
      Em.assert('You should register a gesture. Take a look at the registerGestures injection', !!knownGestures );


      for (var gesture in knownGestures) {
        if (this[gesture+'Start'] || this[gesture+'Change'] || this[gesture+'End']) {

          var optionsHash;
          if (this[gesture+'Options'] !== undefined && typeof this[gesture+'Options'] === 'object') {
            optionsHash = this[gesture+'Options'];
          } else {
            optionsHash = {};
          }

          optionsHash.name = gesture;
          optionsHash.view = this;
          optionsHash.manager = manager;

          var extensions = {};
          if ( optionsHash.isEnabledBinding ) {

            if ( !Ember.isGlobalPath(optionsHash.isEnabledBinding) ) {
              extensions.isEnabledBinding = 'view.'+optionsHash.isEnabledBinding;
            } else {
              extensions.isEnabledBinding = optionsHash.isEnabledBinding;
            }

            optionsHash = Ember.$.extend({}, optionsHash);
            delete optionsHash.isEnabledBinding;
          }

          var currentGesture = knownGestures[gesture].create(optionsHash, extensions);
          if ( extensions.isEnabledBinding ) {

            Ember.run.sync();

          }

          gestures.push(currentGesture);
        }
      }


      set(manager, 'view', this);
      set(manager, 'gestures', gestures);

      set(this, 'eventManager', manager);

    }


  }

});
