var get = Em.get;
var set = Em.set;

/**
@module ember
@submodule ember-touch
*/

/**

  Registry of known gestures in the system. This is a singleton class, and is used by Em.View to analyze instances of Em.View for gesture support.

  You will not use this class yourself. Rather, gesture recognizers will call Em.Gestures.register(name, recognizer) when they want to make the system aware of them.

  @class Gestures
  @namespace Ember
  @extends Em.Object
  @private
  @static
*/
Em.Gestures = Em.Object.create({

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

