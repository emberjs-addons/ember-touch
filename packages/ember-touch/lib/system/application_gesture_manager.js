var get = Em.get, set = Em.set;

/**
@module ember
@submodule ember-touch
*/

/**
  An ApplicationGestureManager instance is registered into the container
  to inform `GestureManager` instances if touch events can
  be dispatched and it stores application gestures and delegates.

  `GestureManager` instances deny dispatching events whenever the `isAllBlocked`
  property is true or `isBlocked` is true and the `shouldReceiveTouch` response
  is false.

  @class ApplicationGestureManager
  @namespace Ember
  @extends Em.Object
*/
Em.ApplicationGestureManager = Em.Object.extend({


  /**
    Access the list of application delegates registered.

    @type GestureDelegates
    @property _gestures
  */
  _delegates: null,


  /**
    Block application gesture recognition when true.
    @property isAllBlocked
    @default false
  */
  isAllBlocked: false,

  /**
    Access the registered gestures in the application.

    @property _gestures
  */
  _gestures: null,

  /**
    View which has blocked the recognizer. This is the
    only view which can unblock the gesture recognition.

    @private
    @property _blockerView
  */
  _blockerView: null,

  /**
    @private
    @property _isBlocked
  */
  _isBlocked: false,

  /**
    Whenever the `isBlocked` property is true, this function
    property decides if a touch event can be dispatched.
    @private
    @property _shouldReceiveTouchFn
  */
  _shouldReceiveTouchFn:null,


  init: function() {
    this._super();
    this._gestures = {};
    this._delegates = {};

  },

  /**
    Register a new gesture in the application

    @method registerGesture
  */
  registerGesture: function(name, recognizer) {

    if (this._gestures[name] !== undefined) {
      throw new Ember.Error(name+" already exists as a registered gesture recognizer. Gesture recognizers must have globally unique names.");
    }

    this._gestures[name] = recognizer;

  },

  /**
    @method unregisterGesture
  */
  unregisterGesture: function(name) {

    if ( this._gestures[name] ) {
      delete this._gestures[name];
    }

  },

  /**
    Get the list of the application gestures

    @method knownGestures
  */
  knownGestures: function() {
    return this._gestures || {};
  },

  /**
    @method registerDelegate
  */
  registerDelegate: function(delegate) {
    this._delegates[ delegate.get('name') ] = delegate;
  },

  /**
    @method findDelegate
  */
  findDelegate: function( name ) {
    return this._delegates[name];
  },


  /**
    @property isBlocked
  */
  isBlocked: Ember.computed(function(){

    return this.get('_isBlocked');

  }).property('_isBlocked'),


  /**
    Whenever the `isBlocked` property is true, the function output is provided
    to `GestureManager` instances to allow or deny dispatching touch events.

    @method shouldReceiveTouch
  */
  shouldReceiveTouch: function(view) {

    return this.get('_shouldReceiveTouchFn')(view);

  },

  /**
    Blocks gesture recognition at the application level and setups
    which events can be dispatched based on the `shouldReceiveTouchFn` parameter.

    @method block
  */
  block: function( view, shouldReceiveTouchFn ) {

    if ( this.get('isBlocked') ) {
      throw new Error('manager has already blocked the gesture recognizer');
    }

    set(this, '_shouldReceiveTouchFn', shouldReceiveTouchFn);
    set(this, '_isBlocked', true);
    set(this, '_blockerView', view);

  },

  /**
    Unblock current gesture blocking state.
    @method unblock
  */
  unblock: function( view ) {

    if ( !this.get('isBlocked') ) {
      throw new Error('unblock, the gesture recognizer when the recognizer was not blocked. Did you unblock after Start? ');
    }

    var blockerView = this.get('_blockerView');

    if ( view !== blockerView ) {
      throw new Error('unblock a view which was not the one which blocked the gesture recognizer');
    }

    this.set('_isBlocked', false);
    this.set('_blockerView', null);
    this.set('_shouldReceiveTouchFn', null);

  }

});
