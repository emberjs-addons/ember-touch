
/**
@module ember
@submodule ember-touch
*/

/**
  An ApplicationGestureManager instance is injected at the Application 
  namespace to inform `GestureManager` instances if touch events can 
  be dispatched.

  `GestureManager` instances denies dispatching events whenever `isAllBlocked` 
  property is true or `isBlocked` is true and the `shouldReceiveTouch` response
  is false.

  @class ApplicationGestureManager
  @namespace Ember
  @extends Em.Object
*/
Em.ApplicationGestureManager = Em.Object.extend({


  /**
    Access registered gestureDelegates in the application.

    @type GestureDelegates
    @property gestureDelegates
  */
  gestureDelegates: null,

  /**
    Access the registered gestures in the application.

    @type RegisteredGestures
    @property registeredGestures
  */
  registeredGestures: null,

  /**
    Block application gesture recognition on true.
    @property isAllBlocked
    @default false
  */
  isAllBlocked: false,

  /**
    View which has blocked the recognizer. This is the 
    only view which can unblock gesture recognition.

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
    Whenever `isBlocked` property is true, this function
    property decides if a touch event can be dispatched.
    @private
    @property _shouldReceiveTouchFn
  */
  _shouldReceiveTouchFn:null,

  /**
    @property isBlocked
  */
  isBlocked: Em.computed(function(){

    return this.get('_isBlocked');

  }).property('_isBlocked'),


  /**
    Whenever `isBlocked` property is true, the function output is provided 
    to `GestureManager` instances to allow or deny dispatching touch events.

    @method shouldReceiveTouch
  */
  shouldReceiveTouch: function(view) {

    return this.get('_shouldReceiveTouchFn')(view);

  },

  /**
    Blocks gesture recognition at the application level and setup
    which events can be dispatched based on the `shouldReceiveTouchFn` parameter.

    @method block
  */
  block: function( view, shouldReceiveTouchFn ) {

    if ( this.get('isBlocked') ) {
      throw new Error('manager has already blocked the gesture recognizer');
    }


    this.set('_shouldReceiveTouchFn', shouldReceiveTouchFn);
    this.set('_isBlocked', true);
    this.set('_blockerView', view);

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
