var get = Em.get;
var set = Em.set;

/**
@module ember
@submodule ember-touch
*/

/**

  Registry of known gestures in the system which is used in the view's `init`
  method to find which gestures are supported by the initialized view.

  An instance of this class is injected into the Application namespace and
  adds default built-in gestures provided in the `ember-touch` package.

  The programmer must register his own gestures when he wants the system
  to be aware of them.

  @class RegisteredGestureList
  @namespace Ember
  @extends Em.Object
  @private
*/
Em.RegisteredGestures = Em.Object.extend({

  /**
    @property _registeredGestures
    @type Hash
    @private
  */
  _registeredGestures: null,

  init: function() {
    this._registeredGestures = {};

    return this._super();
  },

  /**
    Registers a gesture recognizer to the system.
    The gesture recognizer is identified by the name parameter. It must be globally unique.

    @method register
  */
  register: function(name, /** Em.Gesture */recognizer) {
    var registeredGestures = this._registeredGestures;

    if (registeredGestures[name] !== undefined) {
      throw new Em.Error(name+" already exists as a registered gesture recognizer. Gesture recognizers must have globally unique names.");
    }

    registeredGestures[name] = recognizer;
  },

  /**
    Unregister a gesture.
    @method unregister
  */
  unregister: function(name) {
    var registeredGestures = this._registeredGestures;

    if (registeredGestures[name] !== undefined) {
      registeredGestures[name] = undefined;
    }
  },

  /**
    Registers a gesture recognizer in the system.
    The gesture recognizer is identified by the name parameter
    which must be unique in the application.

    @method knownGestures
  */
  knownGestures: function() {
    var registeredGestures = this._registeredGestures;

    return (registeredGestures)? registeredGestures : {};
  }

});

