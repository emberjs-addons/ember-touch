var get = Em.get, set = Em.set;

/* 
  Extends Em.View by making the init method gesture-aware.
*/
Em.View.reopen(
/** @scope Em.View.prototype */{

  /**
    The Em.GestureManager instance which will manager the gestures of the view.    
    This object is automatically created and set at init-time.

    @default null
    @type Array
  */
  eventManager: null,

  /**
    Inspects the properties on the view instance and create gestures if they're 
    used.
  */
  init: function() {
    this._super();

    var knownGestures = Em.Gestures.knownGestures();
    var eventManager = get(this, 'eventManager');

    if (knownGestures && !eventManager) {
      var gestures = [];

      var manager = Em.GestureManager.create({
      });


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

