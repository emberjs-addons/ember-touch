// ==========================================================================
// Project:  Ember Touch
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Em.get;
var set = Em.set;

/** 
  @class
  
  Extends Em.View by making the init method gesture-aware.

  @extends Em.Object
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
        appGestureManager: Em.AppGestureManager
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

          gestures.push(knownGestures[gesture].create(optionsHash));
        }
      }
      
      //gestures: gestures,
      set(manager, 'view', this);
      set(manager, 'gestures', gestures);

      set(this, 'eventManager', manager);
 
    }
  },

  unblockGestureRecognizer: function() {

    var eventManager = get(this, 'eventManager');
    eventManager.appGestureManager.unblock(this);

  }

});

