var get = Em.get;
var set = Em.set;

/**
@module ember
@submodule ember-touch
*/

/**

  Registry of known gestures in the system to be used on view creation to find which gestures are implemented in the view class. A instance of this class is injected in the Application namespace.

  You must be responsable to register your own gestures when you want to make the system aware of them.

  @class RegisteredGestureList
  @namespace Ember
  @extends Em.Object
  @private
  @static
*/
Em.RegisteredGestures = Em.Object.extend({

  /**
    @method _registeredGestures
    @private
  */
  _registeredGestures: null,

  init: function() {
    this._registeredGestures = {};

    return this._super();
  },

  /**
    Registers a gesture recognizer to the system. The gesture recognizer is identified by the name parameter, which must be globally unique.

    @method register
  */
  register: function(name, /** Em.Gesture */recognizer) {
    var registeredGestures = this._registeredGestures;

    if (registeredGestures[name] !== undefined) {
      throw new Em.Error(name+" already exists as a registered gesture recognizers. Gesture recognizers must have globally unique names.");
    }

    registeredGestures[name] = recognizer;
  },

  /**
    @method unregister
  */
  unregister: function(name) {
    var registeredGestures = this._registeredGestures;

    if (registeredGestures[name] !== undefined) {
      registeredGestures[name] = undefined;
    }
  },

  /**
    Registers a gesture recognizer to the system. The gesture recognizer is identified by the name parameter, which must be unique across the system.

    @method knownGestures
  */
  knownGestures: function() {
    var registeredGestures = this._registeredGestures;

    return (registeredGestures)? registeredGestures : {};
  }

});

