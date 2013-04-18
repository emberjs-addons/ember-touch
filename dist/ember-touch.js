// ==========================================================================
// Project:   Ember Touch - Touch and Gesture Library For Ember
// Copyright: ©2011-2012 Pepe Cano and contributors
//            Portions ©2006-2011 Strobe Inc.
// License:   Licensed under MIT license
//            See https://raw.github.com/emberjs-addons/ember-touch/master/LICENSE
// ==========================================================================


(function() {
Em.TimeoutTouchEventType = {
  Cancel: 'cancel',
  End: 'end'
};

/**
Based on custom  gestures implementation. A `TimeoutTouchEvent` event is
normally created to fire automatically after a given period of time.
A view [gesture]Event which must be executed without being generated
by an user touch event.

@class TimeoutTouchEvent
@namespace Ember
*/
Em.TimeoutTouchEvent = function(options){
  this.type = options.type;
};

})();



(function() {
var get = Em.get; var set = Em.set;

/**
@module ember
@submodule ember-touch
*/
/**
  This component manages and maintains a list of active touches related
  to a gesture recognizer.

  @class TouchList
  @namespace Ember
  @extends Ember.Object
  @private
*/
Em.TouchList = Em.Object.extend({

  /**
    @property touches
    @type Array
  */
  touches: null,

  /**
    @property timestamp
  */
  timestamp: null,

  init: function() {
    this._super();

    set(this, 'touches', []);
  },

  /**
    Add a touch event to the list.
    This method is called only in the initialization of
    the touch session adding touchstart events.

    @method addTouch
  */
  addTouch: function(touch) {
    var touches = get(this, 'touches');
    touches.push(touch);
    this.notifyPropertyChange('touches');
  },

  /**
    Update a touch event from the list.
    Given a touch event, it will iterate the current
    list to replace with the event the item whose
    identifier is equal to the event identifier.
    @method updateTouch
  */
  updateTouch: function(touch) {
    var touches = get(this, 'touches');

    for (var i=0, l=touches.length; i<l; i++) {
      var _t = touches[i];

      if (_t.identifier === touch.identifier) {
        touches[i] = touch;
        this.notifyPropertyChange('touches');
        break;
      }
    }
  },

  /**
    Reset the touch list.
    @method removeAllTouches
  */
  removeAllTouches: function() {
    set(this, 'touches', []);
  },

  /**
    Given a touch identifier, it returns the touch event
    with the same identifier in the list.

    @method touchWithId
  */
  touchWithId: function(id) {
    var ret = null,
        touches = get(this, 'touches');

    for (var i=0, l=touches.length; i<l; i++) {
      var _t = touches[i];

      if (_t.identifier === id) {
        ret = _t;
        break;
      }
    }

    return ret;
  },


  /**
    Length of the touch list.
    @property length
  */
  length: Ember.computed(function() {
    var touches = get(this, 'touches');
    return touches.length;
  }).property('touches').cacheable()

});

})();



(function() {

})();



(function() {
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

})();



(function() {
/**
@module ember
@submodule ember-touch
*/
/**
  Defines a rule on its `shouldReceiveTouch` method
  to be used by a `GestureDelegate` instance.

  @class GestureDelegateRule
  @namespace Ember
  @extends Ember.Object
*/
Em.GestureDelegateRule = Em.Object.extend({

  /**
    @method shouldReceiveTouch
  */
  shouldReceiveTouch: function(gesture, view, event) {

  }

});

})();



(function() {

/**
@module ember
@submodule ember-touch
*/
/**
GestureDelegate allows `GestureManager` instances decide
if a touch event can be dispatched to a view gesture.

Gestures can be set up using a `GestureDelegate` to coordinate
the gesture recognition based on application logic.

@class GestureDelegate
@namespace Ember
@extends Ember.Object
*/
Em.GestureDelegate = Em.Object.extend({

  /**
    Name of the gestureDelegate.
    This optional property can be used on gestureOptions
    to assign a gestureDelegate to a specific gesture.

    @property name
    @type Array
  */
  name: null,

  /**
    Array of `GestureDelegateRule` which can be setup
    with string path, extended classes or instances.
    In runtime, they are intented to be checked before
    `GestureDelegate.shouldReceiveTouch` call.

    @property rules
    @type Array
   */
  rules: null,

  init: function(){

    this._super();

    var rules = this.rules,
        current = [],
        rule;

    if ( !!rules ) {

      var i,
          max;

      for ( i=0, max=rules.length; i<max; i++ ) {

        rule = rules[i];

        if ( Em.typeOf(rule) === "string" ) {
          rule = Em.get(rule);
        }

        if ( !rule.isInstance ) {
          rule = rule.create();
        }

        current.push( rule );
      }

    }

    this.rules = current;

  },

  /**
    Respond if a gesture recognizer should receive a touch event.

    @method shouldReceiveTouch
    @return Boolen
  */
  shouldReceiveTouch: function(gesture, view, event) {
    return true;
  }

});

})();



(function() {
var get = Em.get; var set = Em.set;

/**
  @module ember
  @submodule ember-touch
*/

/**
`Em.GestureManager` mainly acts as a composite for the multiple gesture
recognizers associated with a view.

This class is instantiated automatically by Em.View and it shouldn't be
directly accessed.

Whenever it gets a touch event, it relays it to the gestures when
coordination conditions are satisfied.

The other main resposibility of `Em.GestureManager` is to manage
event bubbling.

@class GestureManager
@namespace Ember
@extends Ember.Object
*/
Em.GestureManager = Em.Object.extend({

  /**
    An array containing all the gesture recognizers associated with a
    view. This is set automatically by `Em.View`.


    @property gestures
    @default null
    @type Array
  */
  gestures: null,

  /**
    @type Em.ApplicationGestureManager
    @property applicationGestureManager
  */
  //applicationGestureManager: null,

  applicationGestureManager: Ember.computed(function() {
    return this.view.get('container').lookup('gesture:application');
  }),

  container: null,

  /**
    The Em.View which belongs this `GestureManager` instance.

    @property view
    @type Em.View
  */
  view: null,

  /**
    Relays touchStart events to all the gesture recognizers to the
    specified view when coordination conditions are satisfied.

    @method touchStart
    @return Boolen
  */
  touchStart: function(evt, view) {
    return this._invokeEvent('touchStart',evt);
  },

  /**
    Relays touchMove events to all the gesture recognizers to the
    specified view when coordination conditions are satisfied.

    @method touchMove
    @return Boolen
  */
  touchMove: function(evt, view) {
    return this._invokeEvent('touchMove',evt);
  },

  /**
    Relays touchEnd events to all the gesture recognizers to the
    specified view when coordination conditions are satisfied.

    @method touchEnd
    @return Boolen
  */
  touchEnd: function(evt, view) {
    return this._invokeEvent('touchEnd',evt);
  },

  /**
    Relays touchCancel events to all the gesture recognizers to the
    specified view when coordination conditions are satisfied.

    @method touchCancel
    @return Boolen
  */
  touchCancel: function(evt, view) {
    return this._invokeEvent('touchCancel',evt);
  },

  /**
    Relays an event to the gesture recognizers. Used internally
    by the touch event listeners. Propagates the event to the parentViews.

    @private
    @method _invokeEvent
    @return Boolean
  */
  _invokeEvent: function(eventName, eventObject) {

    var gestures = this.get('gestures'),
        l =  gestures.length,
        handler,
        result = true;

    // view can response directly to touch events
    handler = this.view[eventName];
    if (Em.typeOf(handler) === 'function') {
      handler.call(this.view, eventObject);
    }


    var agm = this.get('applicationGestureManager'); 

    if ( !agm.get('isAllBlocked') ) {

      if ( l > 0 ) {

        //appGestureManager allow to pass touchEvents at the App Level
        var gesturesCanReceiveTouchEvent = agm.get('isBlocked')? agm.shouldReceiveTouch(this.view) : true;
        if ( gesturesCanReceiveTouchEvent ) {

          var gesture,
              gestureDelegate,
              isValid,
              i;

          for (i=0; i < l; i++) {
            gesture = gestures[i];
            handler = gesture[eventName];

            if (Em.typeOf(handler) === 'function') {

              gestureDelegate = gesture.get('delegate');

              if ( !gesture.get('isEnabled') ) {
                isValid = false;
              //gestureDelegate allow to pass touchEvents depending on gesture state
              } else if ( !gestureDelegate ) {
                isValid = true;
              } else {

                isValid = this._applyDelegateRules( gestureDelegate,  gesture, this.view, eventObject );
                if ( isValid === undefined ) {
                  isValid = gestureDelegate.shouldReceiveTouch( gesture, this.view, eventObject );
                }

              }

              if ( isValid ) {
                result = handler.call(gesture, eventObject);
              }

            }
          }

        }

      }

      // browser delivers the event to the DOM element
      // bubble the event to the parentView
      var parentView = this.view.get('parentView');
      if ( parentView ) {
        var manager = parentView.get('eventManager');
        if ( manager ) { manager._invokeEvent(eventName, eventObject); }
      }

    }

    return result;

  },

  /**
    Iterates all `GestureDelegateRule` instances of the gestureDelegate parameter
    executing its shouldReceiveTouch method and return the value whenever
    a rule respond with a defined value.

    @private
    @method _applyDelegateRules
    @return Boolean
  */
  _applyDelegateRules: function(gestureDelegate, gesture, view, event) {

    var rules = gestureDelegate.rules,
        length = rules.length;

    if ( length > 0 ) {

      var i,
          result;

      for (i=0;i<length;i++) {
        result = rules[i].shouldReceiveTouch(gesture, view, event);
        if ( result !== undefined ) {
          return result;
        }
      }
    }

    return undefined;

  }

});

})();



(function() {
var get = Em.get, set = Em.set;

/**
@module ember
@submodule ember-touch
*/

/**
Base class to be extended to define specific gesture recognizers. Handles low-level touch
events and state management. It also provides some utility methods to the extended classes.

  @class Gesture
  @namespace Ember
  @extends Ember.Object
*/
Em.Gesture = Em.Object.extend({

  /**
    The current state of the gesture recognizer. This value can be any of the
    following:

      WAITING_FOR_TOUCHES
      POSSIBLE
      BEGAN
      CHANGED
      ENDED
      CANCELLED

    @property state
    @type Number
  */
  state: null,

  /**
    A string to identify the gesture recognizer's name. This value is set automatically
    by Em.Gestures when a gesture is registered.

    @property name
    @type String
  */
  name: null,

  /**
    View in which the gesture must be recognized.
    Assigned on startup.
  */
  view: null,

  /**
    Assigned on startup.
  */
  applicationGestureManager: Ember.computed(function() {
    // TODO: more elegant way
    return this.view.get('container').lookup('gesture:application');
  }),

  container: null,

  /**
    Specifies whether a gesture is discrete or continuous.

    @property gestureIsDiscrete
    @type Boolean
    @default false
  */
  gestureIsDiscrete: false,


  /**
    This property enables to recognize gestures simultaneously. Whenever a gesture
    is being recognized and its `simultaneously` property is false, it denies other
    gestures to be recognized at the same time.

    @property simultaneously
    @type Boolean
    @default true
  */
  simultaneously: true,

  /**
    Used this property to assign a `GestureDelegate` instance to the `delegate` property
    in the `init` process.

    @property delegateName
    @type String
  */
  delegateName: null,

  /**
    Apply a `GestureDelegate` to customize an application's gesture-recognition behavior.

    @property delegate
    @type Em.GestureDelegate
  */
  delegate: null,

  /**
    Use this property to disable the gesture recognition.
    Use isEnabledBinding to bind to global or view properties.

    @property isEnabled
    @type Boolean
    @default true
  */
  isEnabled: true,


  /**
    Manage and maintain a list of active touches related to a gesture recognizer.

    A gesture updates automatically its internal touch list
    to have only the last active touch events.

    Custom gestures may not interact with the `TouchList` methods,
    it is usually the gesture API which manages its touch list.

    Custom gestures usually access its length property and
    the internal touch list to have information of the last
    active touch events.

    @protected
    @property touches
    @type Em.TouchList
  */
  touches: null,

  /**
    You can also use the numberOfActiveTouches property to inspect how many touches
    are active, this is mostly useful in `shouldBegin` since every other callback can
    assume that there are as many active touches as specified in the
    `numberOfRequiredTouches` property.

    @private
    @property numberOfActiveTouches
    @type Number
  */
  numberOfActiveTouches: 0,

  /**
    Used to specify the number of touches required for the gesture to enter a possible
    state

    @private
    @property numberOfRequiredTouches
    @type Number
  */
  numberOfRequiredTouches: 1,

  init: function() {

    this._super();
    this.touches = Em.TouchList.create();
    this.name = get(this, 'name');

    var delegateName =  this.get('delegateName');
    var delegate =  this.get('delegate');

    if (!delegate && delegateName ) {

      var applicationGestureManager = get(this, 'applicationGestureManager');

      delegate = applicationGestureManager.findDelegate(delegateName);
      Em.assert('empty delegate, attempting to set up delegate based on delegateName', delegate);
      set(this, 'delegate', delegate);

    }

  },

  //..............................................
  // Gesture Protected Methods

  /**
    Called when a gesture enters a possible state. This means the gesture
    recognizer has accepted enough touches to match the number of required touches.
    Usually, the internal state is initialized in this callback.
    @protected
    @method didBecomePossible
  */
  didBecomePossible: function() { },

  /**
    Called if a view returns false from a gesture event.
    This callback allows to reset the internal state if the user
    rejects an event.
    @protected
    @method didBegin
  */
  eventWasRejected: function() { },

  /**
    Called if a view returns false from a gesture event. This callback allows
     to reset the internal state if the user rejects an event.
    @protected
    @method shouldBegin
  */
  shouldBegin: function() {
    return true;
  },

  /**
    Called when the gesture enters a began state.
    Called before the view receives the Start event.
    @protected
    @method didBegin
  */
  didBegin: function() { },

  /**
    Called when the gesture enters a began state, and when one of the touches moves.
    Called before the view receives the Change event.
    @protected
    @method didChange
  */
  didChange: function(evt) { },

  /**
    Allows a gesture to block itself from entering an ended state.
    This callback gets called whenever a tracked touch gets a touchEnd event.
    @protected
    @method shouldEnd
  */
  shouldEnd: function() {
    return true;
  },

  /**
    Called when the gesture enters an ended state.
    Called before the view receives the End event.
    @protected
    @method didEnd
  */
  didEnd: function() { },

  /**
    Called when the gesture enters a cancelled state.
    Called before the view receives the Cancel event.
    @protected
    @method didCancel
  */
  didCancel: function() { },

  //..............................................
  // Utilities

  /** @private */


  /**
   If `simultaneously` is true, it blocks the `ApplicationGestureManager` instance.
    @private
    @method blockApplicationGestureManagerIfSimultaneously
   */
  blockApplicationGestureManagerIfSimultaneously: function() {

    if ( !this.simultaneously ) {

      var allowedView = this.view;
      var callback = function(v) {
        return allowedView === v;
      };

      var agm = this.get('applicationGestureManager');
      agm.block.apply(agm, [allowedView, callback]);


    }

  },

  /**
    Notify the event to the view and trigger `eventWasRejected` if the view doesn't
    implement the API or returned false.
    @private
    @method attemptGestureEventDelivery
  */
  attemptGestureEventDelivery: function(eventName, evt) {

    Em.assert('attemptGestureEventDelivery is called with eventName and event arguments', !!eventName && !!evt);

    var wasNotified =  this._notifyViewOfGestureEvent(eventName, evt);
    if ( !wasNotified ) {
      this.eventWasRejected();
    }

  },

  /**
    Given two Touch objects, this method returns the distance between them.
    @private
    @method distance
    @return Number
  */
  distance: function(touches) {

    if (touches.length < 2) {
      return 0;
    }

    var first = touches[0];
    var second = touches[1];

    var x = first.pageX;
    var y = first.pageY;
    var x0 = second.pageX;
    var y0 = second.pageY;

    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
  },

  /**
    Given an array of Touch objects, this method returns the midpoint between them.

    @private
    @method centerPointForTouches
    @return Number
  */
  centerPointForTouches: function(touches) {
    var sumX = 0,
        sumY = 0;

    for (var i=0, l=touches.length; i<l; i++) {
      var touch = touches[i];
      sumX += touch.pageX;
      sumY += touch.pageY;
    }

    var location = {
      x: sumX / touches.length,
      y: sumY / touches.length
    };

    return location;
  },

  /**
    Allows the gesture to notify a view associated with a gesture
    event.

    @private
    @method _notifyViewOfGestureEvent
  */
  _notifyViewOfGestureEvent: function(eventName, evt) {
    var handler = this.view[eventName];
    var result = false;

    if (Em.typeOf(handler) === 'function') {
      result = handler.call(this.view, this, evt);
    }

    return result;
  },

  /**
    @method toString
  */
  toString: function() {
    return Em.Gesture+'<'+Em.guidFor(this)+'>';
  },

  /**
    Reset the touches list.
    @private
    @method _resetState
  */
  _resetState: function() {
    this.touches.removeAllTouches();
  },

  //..............................................
  // Touch event handlers

  /**
    Given a `touchstart` event, updates the list of touches.
    If the `numberOfRequiredTouches` hasn't been reached yet, it sets the
    WAITING_FOR_TOUCHES state. Otherwise when the gesture is discrete, it
    moves to a BEGAN state and applies its logic. Continous gestures are setup
    to the POSSIBLE state and execute their `didBecomePossible` method.
    @method touchStart
  */
  touchStart: function(evt) {
    var targetTouches = evt.originalEvent.targetTouches;
    var _touches = this.touches;
    var state = get(this, 'state');

    set(_touches, 'timestamp', Date.now());

    //Collect touches by their identifiers
    for (var i=0, l=targetTouches.length; i<l; i++) {
      var touch = targetTouches[i];

      if(_touches.touchWithId(touch.identifier) === null  ) {

        if ( _touches.get('length') === get(this, 'numberOfRequiredTouches')  ) {
          // restart touches, otherwise a gesture could stay on a possible state forever
          _touches.removeAllTouches();
        }
        _touches.addTouch(touch);
      }
    }

    if (_touches.get('length') < get(this, 'numberOfRequiredTouches')) {
      set(this ,'state', Em.Gesture.WAITING_FOR_TOUCHES);

    } else {
      if ( this.gestureIsDiscrete ) {

      // Discrete gestures may skip the possible step if they're ready to begin
        //
        if ( this.shouldBegin() ) {
          this.blockApplicationGestureManagerIfSimultaneously();
          set(this, 'state', Em.Gesture.BEGAN);
          this.didBegin();
        }

      } else {
        set(this, 'state', Em.Gesture.POSSIBLE);
        this.didBecomePossible();
      }
    }

  },

  /**
    Given a `touchmove` event, updates the list of touches.
    It changes the currentState to BEGAN and fires the [gesture]Start
    view method.
    If the gesture is discrete, the state is POSSIBLE and its `shouldBegin`
    implementation response true.
    If the current state is BEGAN or CHANGED and the gesture is continuous,
    it applies the CHANGED state and fires the [gesture]Change view method.
    @method touchMove
  */
  touchMove: function(evt) {

    var state = get(this, 'state');

    if (state === Em.Gesture.WAITING_FOR_TOUCHES || state === Em.Gesture.ENDED || state === Em.Gesture.CANCELLED) {

      // Nothing to do here
      return;
    }

    var changedTouches = evt.originalEvent.changedTouches;
    var _touches = this.touches;

    set(_touches, 'timestamp', Date.now());

    // Update touches hash
    for (var i=0, l=changedTouches.length; i<l; i++) {
      var touch = changedTouches[i];
      _touches.updateTouch(touch);
    }

    if (state === Em.Gesture.POSSIBLE && !this.gestureIsDiscrete) {

      if ( this.shouldBegin() ) {

        this.blockApplicationGestureManagerIfSimultaneously();
        set(this, 'state', Em.Gesture.BEGAN);
        this.didBegin();

        // Give the gesture a chance to update its state so the view can get
        // updated information in the Start event
        this.didChange(evt);
        this.attemptGestureEventDelivery(this.name+'Start', evt);
      }

    } else if (state === Em.Gesture.BEGAN || state === Em.Gesture.CHANGED)  {

      set(this, 'state', Em.Gesture.CHANGED);
      this.didChange(evt);

      // Discrete gestures don't fire changed events
      if ( !this.gestureIsDiscrete ) {

        this.attemptGestureEventDelivery(this.name+'Change', evt);

      }

    }


  },

  /**
    Given a `touchend` event, updates the list of touches, manages the event and finally
    resets the `touch` list.
    If the current state is either BEGAN or CHANGED and `shouldEnd` response is true,
    it changes the state to ENDED, performs `didEnd` method and fires the [gesture]End
    view method.
    @method touchEnd
  */
  touchEnd: function(evt) {
    var state = get(this, 'state');
    var _touches = this.touches;
    set(_touches, 'timestamp', Date.now());


    var changedTouches = (evt && evt.originalEvent ) ? evt.originalEvent.changedTouches : undefined;
    if ( changedTouches ) {
      // Update touches hash
      for (var i=0, l=changedTouches.length; i<l; i++) {
        var touch = changedTouches[i];
        _touches.updateTouch(touch);
      }
    }

    if ( ( state === Em.Gesture.BEGAN || state === Em.Gesture.CHANGED ) && this.shouldEnd() ) {

      // Discrete gestures use shouldEnd to either accept or decline the gesture.
      set(this, 'state', Em.Gesture.ENDED);
      this.didEnd();
      this.attemptGestureEventDelivery(this.name+'End', evt);

    }
    this._resetState();
  },

  /**
    Given a `touchcancel` event, resets the `touch` list, and when the
    current state is different than CANCEL, set the state to CANCEL, performs
    `didCancel` method and if the gesture is continuous fires the [gesture]Cancel
    view method.
    @method touchCancel
  */
  touchCancel: function(evt) {
    var state = get(this, 'state');

    if ( state !== Em.Gesture.CANCELLED) {

      set(this, 'state', Em.Gesture.CANCELLED);
      this.didCancel();

      if ( !this.gestureIsDiscrete ) {
        this.attemptGestureEventDelivery(this.name+'Cancel', evt);
      }

    }

    this._resetState();

  }

});

Em.GestureDirection = {
  Vertical: 1,
  Horizontal: 2
};


Em.OneGestureDirection = {
  Right: 1,
  Left: 2,
  Down: 4,
  Up: 8
};

Em.Gesture.WAITING_FOR_TOUCHES = 0;
Em.Gesture.POSSIBLE = 1; // only continuous
Em.Gesture.BEGAN = 2;
Em.Gesture.CHANGED = 3;
Em.Gesture.ENDED = 4;
Em.Gesture.CANCELLED = 5;

})();



(function() {
var set = Ember.set, get = Ember.get;

Em.Application.reopen({

  gestureManager: Ember.computed(function() {
    // TODO: more elegant way
    return this.__container__.lookup('gesture:application');
  })

});


Ember.Application.initializer({

  name: 'gestureManager',
  before: 'defaultGestures',

  initialize: function(container) {
    container.register('gesture:application', Ember.ApplicationGestureManager);
  }

});

Ember.Application.initializer({

  name: 'defaultGestures',
  after: 'gestureManager',

  initialize: function(container) {

    var gestureManager = container.lookup('gesture:application');

    gestureManager.registerGesture('pan', Em.PanGestureRecognizer);
    gestureManager.registerGesture('pinch', Em.PinchGestureRecognizer);
    gestureManager.registerGesture('press', Em.PressGestureRecognizer);
    gestureManager.registerGesture('swipe', Em.SwipeGestureRecognizer);
    gestureManager.registerGesture('tap', Em.TapGestureRecognizer);
    gestureManager.registerGesture('touchHold', Em.TouchHoldGestureRecognizer);

  }

});

})();



(function() {
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

})();



(function() {

})();



(function() {
var get = Em.get, set = Em.set;

/**
 @module ember
 @submodule ember-touch
*/
/**
Recognizes a multi-touch pinch gesture. Pinch gestures require a specified
number of fingers to move and will record and update the scale.

For pinchChange events, the pinch gesture recognizer includes a scale property
which can be applied as a CSS transform directly.

    var myview = Em.View.create({
      elementId: 'gestureTest',

      pinchChange: function(rec, evt) {
        this.$().css('scale',function(index, value) {
          return rec.get('scale') * value
        });
      }
    });

The number of touches required to start the gesture can be specified with the
_numberOfRequiredTouches_ property. This property can be set in the
pinchOptions hash.

    var myview = Em.View.create({
      pinchOptions: {
        numberOfRequiredTouches: 3
      }
    });

@class PinchGestureRecognizer
@namespace Ember
@extends Em.Gesture
*/
Em.PinchGestureRecognizer = Em.Gesture.extend({

  /**
    The scale value which represents the current amount of scaling that has
    been applied to the view.

    @type Number
  */
  scale: 1,

  numberOfRequiredTouches: 2,

  //..................................................
  // Private Methods and Properties

  /**
    Track starting distance between touches per gesture.

    @private
    @type Number
  */
  _startingDistanceBetweenTouches: null,

  /**
    Used for measuring velocity

    @private
    @type Number
  */
  _previousTimestamp: null,

  /**
    Used for measuring velocity and scale

    @private
    @type Number
  */
  _previousDistance: 0,

  /**
    The pixel distance that the fingers need to get closer/farther away by before
    this gesture is recognized.

    @private
    @type Number
  */
  _deltaThreshold: 5,

  /**
    Used for rejected events

    @private
    @type Number
  */
  _previousScale: 1,

  /**
    @private
  */
  didBecomePossible: function() {
    this._startingDistanceBetweenTouches = this.distance(get(this.touches,'touches'));
    this._previousDistance = this._startingDistanceBetweenTouches;
    this._previousTimestamp = get(this.touches,'timestamp');
  },

  shouldBegin: function() {
    var currentDistanceBetweenTouches = this.distance(get(this.touches,'touches'));

    return Math.abs(currentDistanceBetweenTouches - this._startingDistanceBetweenTouches) >= this._deltaThreshold;
  },

  didChange: function() {
    var scale = this._previousScale = get(this, 'scale');
    var timeDifference = this.touches.timestamp - this._previousTimestamp;
    var currentDistanceBetweenTouches = this.distance(get(this.touches,'touches'));
    var distanceDifference = (currentDistanceBetweenTouches - this._previousDistance);

    set(this, 'velocity', distanceDifference / timeDifference);
    set(this, 'scale', currentDistanceBetweenTouches / this._previousDistance);

    this._previousTimestamp = get(this.touches,'timestamp');
    this._previousDistance = currentDistanceBetweenTouches;
  },

  eventWasRejected: function() {
    set(this, 'scale', this._previousScale);
  }

});


})();



(function() {
var get = Em.get, set = Em.set;

/**
 @module ember
 @submodule ember-touch
*/

/**
Recognizes a multi-touch pan gesture. Pan gestures require a specified number
of fingers to move. It will record and update the center point between the
touches.

For panChange events, the pan gesture recognizer includes a translation
property which can be applied as a CSS transform directly. Translation values
are hashes which contain an x and a y value.

    var myview = Em.View.create({
      elementId: 'gestureTest',

      panChange: function(rec, evt) {
        var val = rec.get('translation');
        this.$().css({
          translateX: '%@=%@'.fmt((val.x < 0)? '-' : '+',Math.abs(val.x)),
          translateY: '%@=%@'.fmt((val.y < 0)? '-' : '+',Math.abs(val.y))
        });
      }
    });

The number of touches required to start the gesture can be specified with the
_numberOfRequiredTouches_ property. This property can be set in the panOptions
hash.

    var myview = Em.View.create({
      panOptions: {
        numberOfRequiredTouches: 2
      }
    });

@class PanGestureRecognizer
@namespace Ember
@extends Em.Gesture
*/
Em.PanGestureRecognizer = Em.Gesture.extend({

  /**
    The translation value which represents the current amount of movement that
    has been applied to the view.

    @type Location
  */
  translation: null,


  /**
    The pixel distance that the fingers need to move before the gesture is
    recognized.
    It should be set depending on the device factor and view behaviors.
    Distance is calculated separately on vertical and horizontal directions
    depending on the direction property.

    @private
    @type Number
  */
  initThreshold: 5,

  direction:  Em.GestureDirection.Horizontal | Em.GestureDirection.Vertical ,

  //..................................................
  // Private Methods and Properties

  /**
    Used to measure offsets

    @private
    @type Number
  */
  _previousLocation: null,

  /**
    Used for rejected events

    @private
    @type Hash
  */
  _previousTranslation: null,


  init: function() {
    this._super();
    set(this, 'translation', {x:0,y:0});
  },

  didBecomePossible: function() {

    this._previousLocation = this.centerPointForTouches(get(this.touches,'touches'));
  },

  shouldBegin: function() {
    var previousLocation = this._previousLocation;
    var currentLocation = this.centerPointForTouches(get(this.touches,'touches'));

    var x = previousLocation.x;
    var y = previousLocation.y;
    var x0 = currentLocation.x;
    var y0 = currentLocation.y;

    var shouldBegin = false;
    //shouldBegin = Math.sqrt( (x - x0)*(x - x0) + (y - y0)*(y - y0)   ) >= this.initThreshold;

    if ( this.direction & Em.GestureDirection.Vertical ) {

      shouldBegin = Math.abs( y - y0 ) >= this.initThreshold;

    }
    if (!shouldBegin && ( this.direction & Em.GestureDirection.Horizontal ) ) {

      shouldBegin = Math.abs( x - x0 ) >= this.initThreshold;

    }

    return shouldBegin;

  },

  didChange: function() {
    var previousLocation = this._previousLocation;
    var currentLocation = this.centerPointForTouches(get(this.touches,'touches'));
    var translation = {x:currentLocation.x, y:currentLocation.y};

    translation.x = currentLocation.x - previousLocation.x;
    translation.y = currentLocation.y - previousLocation.y;

    this._previousTranslation = get(this, 'translation');
    set(this, 'translation', translation);
    this._previousLocation = currentLocation;
  },

  eventWasRejected: function() {
    set(this, 'translation', this._previousTranslation);
  },

  toString: function() {
    return Em.PanGestureRecognizer+'<'+Em.guidFor(this)+'>';
  }

});


})();



(function() {
var get = Em.get, set = Em.set;

/**
 @module ember
 @submodule ember-touch
*/
/**
Recognizes a multi-touch tap gesture. Tap gestures allow for a certain amount
of wiggle-room between a start and end of a touch. Taps are discrete gestures
so only tapEnd() will get fired on a view.

    var myview = Em.View.create({
      elementId: 'gestureTest',

      tapEnd: function(recognizer, evt) {
        $('#gestureTest').css('background','yellow');
      }
    });

The number of touches required to start the gesture can be specified with the
_numberOfRequiredTouches_ property, which can be set in the tapOptions hash.

    var myview = Em.View.create({
      tapOptions: {
        numberOfRequiredTouches: 3
      }
    });

And the number of taps required to fire the gesture can be specified using the
_numberOfTaps_ property.

    var myview = Em.View.create({
      tapOptions: {
        numberOfTaps: 3,
        delayBetweenTaps: 150
      }
    });

@class TapGestureRecognizer
@namespace Ember
@extends Em.Gesture
*/
Em.TapGestureRecognizer = Em.Gesture.extend({

  /**
    The translation value which represents the current amount of movement that
    has been applied to the view.

    @type Location
  */
  numberOfTaps: 1,

  delayBetweenTaps: 500,

  tapThreshold: 10,

  //..................................................
  // Private Methods and Properties

  /** @private */
  gestureIsDiscrete: true,

  /** @private */
  _initialLocation: null,

  /** @private */
  _waitingTimeout: null,

  /** @private */
  _waitingForMoreTouches: false,

  _internalTouches: null,

  init: function(){
    this._super();
    this._internalTouches = Em.TouchList.create();
    Em.assert( get(this, 'numberOfRequiredTouches')===1, 'TODO: implement!!' );
  },

  shouldBegin: function() {

    return get(this.touches,'length') === get(this, 'numberOfRequiredTouches');

  },

  didBegin: function() {

    this._initialLocation = this.centerPointForTouches(get(this.touches,'touches'));
    this._internalTouches.addTouch( this.touches[0] );

    this._waitingForMoreTouches = get(this._internalTouches,'length') < get(this, 'numberOfTaps');

    if ( this._waitingForMoreTouches ) {

      var that = this;
      this._waitingTimeout = window.setTimeout( function() {
        that._waitingFired(that);
      }, this.delayBetweenTaps);

    }

  },

  shouldEnd: function() {

    var currentLocation = this.centerPointForTouches(get(this.touches,'touches'));

    var x = this._initialLocation.x;
    var y = this._initialLocation.y;
    var x0 = currentLocation.x;
    var y0 = currentLocation.y;

    var distance = Math.sqrt((x -= x0) * x + (y -= y0) * y);

    return (Math.abs(distance) < this.tapThreshold) && !this._waitingForMoreTouches;

  },



  didEnd: function() {

    window.clearTimeout( this._waitingTimeout );


    // clean internalState
    this._initialLocation = null;
    this._internalTouches.removeAllTouches();

  },

  _waitingFired: function() {

    // clean internalState
    this._initialLocation = null;
    this._internalTouches.removeAllTouches();

    // set state for the gesture manager
    set(this, 'state', Em.Gesture.CANCELLED);
    var eventName = this.name+'Cancel';
    var evt = new Em.TimeoutTouchEvent({type: Em.TimeoutTouchEventType.Cancel});
    this.attemptGestureEventDelivery(eventName, evt);
    this._resetState();

  },


  toString: function() {
    return Em.TapGestureRecognizer+'<'+Em.guidFor(this)+'>';
  }

});

})();



(function() {
var get = Em.get, set = Em.set;

/**
 @module ember
 @submodule ember-touch
*/
/**
Recognizes a multi-touch press gesture. Press gestures allow for a certain
amount of wiggle-room between a start and end of a touch, and requires a
minimum hold period to be triggered. The press gesture also requires to
stop touching the screen to be triggered.

Press gestures are discrete so only _pressEnd_ will get fired.

    var myview = Em.View.create({
      elementId: 'gestureTest',

      pressEnd: function(recognizer, evt) {

      }
    });

The number of touches required to start the gesture can be specified with the
_numberOfRequiredTouches_ and _pressPeriodThreshold_ properties.
This properties can be set in the _pressHoldOptions_ hash:

    var myview = Em.View.create({
      pressOptions: {
        pressPeriodThreshold: 500
      }
    });

@class PressGestureRecognizer
@namespace Ember
@extends Em.Gesture
*/
Em.PressGestureRecognizer = Em.Gesture.extend({

  /**
    The minimum period (ms) that the fingers must be held to recognize the gesture end.

    @private
    @type Number
  */
  pressPeriodThreshold: 500,
  //..................................................
  // Private Methods and Properties

  /** @private */
  gestureIsDiscrete: true,

  /** @private */
  _initialLocation: null,

  /** @private */
  _moveThreshold: 10,

  /** @private */
  _initialTimestamp: null,


  shouldBegin: function() {
    return get(this.touches,'length') === get(this, 'numberOfRequiredTouches');
  },

  didBegin: function() {
    this._initialLocation = this.centerPointForTouches(get(this.touches,'touches'));
    this._initialTimestamp = get(this.touches,'timestamp');
  },

  shouldEnd: function() {

    var currentLocation = this.centerPointForTouches(get(this.touches,'touches'));

    var x = this._initialLocation.x;
    var y = this._initialLocation.y;
    var x0 = currentLocation.x;
    var y0 = currentLocation.y;

    var distance = Math.sqrt((x -= x0) * x + (y -= y0) * y);

    var isValidDistance = (Math.abs(distance) < this._moveThreshold);


    var nowTimestamp = get(this.touches,'timestamp');
    var isValidHoldPeriod = (nowTimestamp - this._initialTimestamp ) >= this.pressPeriodThreshold;

    var result = isValidDistance && isValidHoldPeriod;

    if  ( !result ) {
      set(this, 'state', Em.Gesture.CANCELLED);
      this.didCancel();
    }

    return result;
  },

  didEnd: function() {

    this._resetCounters();

  },

  didCancel: function() {

    this._resetCounters();

  },

  _resetCounters: function() {

    this._initialLocation = null;
    this._initialTimestamp = null;

  },

  toString: function() {
    return Em.PressGestureRecognizer+'<'+Em.guidFor(this)+'>';
  }

});

})();



(function() {
var get = Em.get, set = Em.set;

/**
 @module ember
 @submodule ember-touch
*/
/**
Recognizes a multi-touch touch and hold gesture.

Touch and Hold gestures allow move the finger on the same view, and after
the user leaves its finger motionless during a specific period the end view
event is automatically triggered.

TouchHold are discrete gestures so only _touchHoldEnd_ will get fired.

    var myview = Em.View.create({
      elementId: 'gestureTest',

      touchHoldEnd: function(recognizer, evt) {

      }
    });


The number of touches required to start the gesture can be specified with the
following properties:
- _numberOfRequiredTouches_
- a minimum _holdPeriod_ the finger must be held to trigger the end event
- _modeThreshold_ which allows to move the finger a specific number of pixels
This properties can be set in the touchHoldOptions

    var myview = Em.View.create({
      touchHoldOptions: {
        holdPeriod: 500,
        moveThreshold: 10
      }
    });


@class TouchHoldGestureRecognizer
@namespace Ember
@extends Em.Gesture
**/
Em.TouchHoldGestureRecognizer = Em.Gesture.extend({

  /**
    The minimum period (ms) that the fingers must be held to trigger the event.

    @private
    @type Number
  */
  holdPeriod: 2000,

  moveThreshold: 50,

  //..................................................
  // Private Methods and Properties

  /** @private */
  gestureIsDiscrete: true,

  _endTimeout: null,

  _targetElement: null,


  shouldBegin: function() {
    return get(this.touches,'length') === get(this, 'numberOfRequiredTouches');
  },

  didBegin: function() {

    this._initialLocation = this.centerPointForTouches(get(this.touches,'touches'));

    var target = get(this.touches,'touches')[0].target;
    set(this,'_target', target );

    var that = this;
    this._endTimeout = window.setTimeout( function() {

      that._endFired(that);

    }, this.holdPeriod);

  },

  didChange: function() {

    var currentLocation = this.centerPointForTouches(get(this.touches,'touches'));

    var x = this._initialLocation.x;
    var y = this._initialLocation.y;
    var x0 = currentLocation.x;
    var y0 = currentLocation.y;

    var distance = Math.sqrt((x -= x0) * x + (y -= y0) * y);

    var isValidMovement = (Math.abs(distance) < this.moveThreshold);
    // ideal situation would be using touchleave event to be notified
    // the touch leaves the DOM element
    if ( !isValidMovement ) {
      this._disableEndFired();
      set(this, 'state', Em.Gesture.CANCELLED);

      //this._resetState(); // let be executed on touchEnd
    }

  },

  // when a touchend event was fired ( cause of removed finger )
  // disable interval action trigger and block end state
  // this event is responsable for gesture cancel
  shouldEnd: function() {

    this._disableEndFired();
    set(this, 'state', Em.Gesture.CANCELLED);
    this.didCancel();

    return  false;

  },

  _endFired: function() {

    this._disableEndFired();

    if ( this.state === Em.Gesture.BEGAN || this.state === Em.Gesture.CHANGED ) {

      set(this, 'state', Em.Gesture.ENDED);

      var eventName = this.name+'End';

      var evt = new Em.TimeoutTouchEvent({type: Em.TimeoutTouchEventType.End});
      this.attemptGestureEventDelivery(eventName, evt);

      //this._resetState(); // let be executed on touchEnd

    }

  },

  _disableEndFired: function() {

     window.clearTimeout(this._endTimeout);

  },

  toString: function() {
    return Em.TouchHoldGestureRecognizer+'<'+Em.guidFor(this)+'>';
  }

});



})();



(function() {
var get = Em.get, set = Em.set;

/**
 @module ember
 @submodule ember-touch
*/
/**
Recognizes a swipe gesture in one or more directions.

Swipes are continuous gestures that will get fired on a view.

    var myview = Em.View.create({

      swipeStart: function(recognizer, evt) {

      },
      swipeChange: function(recognizer, evt) {

      },
      // usually, you will only use this method
      swipeEnd: function(recognizer, evt) {

      },
      swipeCancel: function(recognizer, evt) {

      }
    });

SwipeGestureRecognizer recognizes a swipe when the touch has moved to a
(direction) far enough (swipeThreshold) in a period (cancelPeriod).
The current implementation will only recognize a direction on swipeEnd on
(recognizer.swipeDirection).

    var myview = Em.View.create({
      swipeOptions: {
        direction: Em.OneGestureDirection.Left | Em.OneGestureDirection.Right,
        cancelPeriod: 100,
        swipeThreshold: 10
      }
    });

@class SwipeGestureRecognizer
@namespace Ember
@extends Em.Gesture
*/
Em.SwipeGestureRecognizer = Em.Gesture.extend({

  /**
    The period (ms) in which the gesture should have been recognized.

    @private
    @type Number
  */
  cancelPeriod: 100,
  swipeThreshold: 50,

  /*
    It should be set up depending of the device factor and view behaviors.
    Distance is calculated separately on vertical and horizontal directions
    depending on the direction property.
  */
  initThreshold: 5,

  direction: Em.OneGestureDirection.Right,

  //..................................................
  // Private Methods and Properties

  numberOfRequiredTouches: 1,
  swipeDirection: null,
  _initialLocation: null,
  _previousLocation: null,
  _cancelTimeout: null,


  /**
    The pixel distance that the fingers need to move before this gesture is
    recognized.

    @private
    @type Number
  */


  didBecomePossible: function() {

    this._previousLocation = this.centerPointForTouches(get(this.touches,'touches'));
  },

  shouldBegin: function() {
    var previousLocation = this._previousLocation;
    var currentLocation = this.centerPointForTouches(get(this.touches,'touches'));

    var x = previousLocation.x;
    var y = previousLocation.y;
    var x0 = currentLocation.x;
    var y0 = currentLocation.y;

  //  var distance = Math.sqrt((x -= x0) * x + (y -= y0) * y);

    var shouldBegin = false;

    if ( this.direction & Em.OneGestureDirection.Right ) {
      shouldBegin = ( (x0-x) > this.initThreshold);
    }
    if ( !shouldBegin && ( this.direction & Em.OneGestureDirection.Left )  ) {
      shouldBegin = ( (x-x0) > this.initThreshold);
    }
    if ( !shouldBegin && ( this.direction & Em.OneGestureDirection.Down )  ) {
      shouldBegin = ( (y0-y) > this.initThreshold);
    }
    if ( !shouldBegin && ( this.direction & Em.OneGestureDirection.Up ) ) {
      shouldBegin = ( (y-y0) > this.initThreshold);
    }

    return shouldBegin;
  },

  didBegin: function() {

    this._initialLocation = this.centerPointForTouches(get(this.touches,'touches'));

    var that = this;

    this._cancelTimeout = window.setTimeout( function() {
      that._cancelFired(that);
    }, this.cancelPeriod);

  },

  didChange: function(evt) {

    var currentLocation = this.centerPointForTouches(get(this.touches,'touches'));
    var x = this._initialLocation.x;
    var y = this._initialLocation.y;

    var x0 = currentLocation.x;
    var y0 = currentLocation.y;

    var isValidMovement = false;

    if ( this.direction & Em.OneGestureDirection.Right ) {

      isValidMovement = ( (x0-x) > this.swipeThreshold);
      this.swipeDirection = Em.OneGestureDirection.Right;

    }
    if ( !isValidMovement && ( this.direction & Em.OneGestureDirection.Left )  ) {

      isValidMovement = ( (x-x0) > this.swipeThreshold);
      this.swipeDirection = Em.OneGestureDirection.Left;

    }
    if ( !isValidMovement && ( this.direction & Em.OneGestureDirection.Down )  ) {

      isValidMovement = ( (y0-y) > this.swipeThreshold);
      this.swipeDirection = Em.OneGestureDirection.Down;

    }
    if ( !isValidMovement && ( this.direction & Em.OneGestureDirection.Up ) ) {

      isValidMovement = ( (y-y0) > this.swipeThreshold);
      this.swipeDirection = Em.OneGestureDirection.Up;

    }

    if ( isValidMovement ) {

      this._disableCancelFired();
      set(this, 'state', Em.Gesture.ENDED);

      var eventName = this.name+'End';
      this.attemptGestureEventDelivery(eventName, evt);
      this._resetState();

    }

  },

  // touch end should cancel the gesture
  shouldEnd: function() {

    this._cancelFired();

    return  false;

  },

  _cancelFired: function() {

    this._disableCancelFired();
    set(this, 'state', Em.Gesture.CANCELLED);

    var eventName = this.name+'Cancel';
    var evt = new Em.TimeoutTouchEvent({type: Em.TimeoutTouchEventType.Cancel});
    this.attemptGestureEventDelivery(eventName, evt);
    this._resetState();

  },

  _disableCancelFired: function() {

     window.clearTimeout( this._cancelTimeout );

  },

  toString: function() {
    return Em.SwipeGestureRecognizer+'<'+Em.guidFor(this)+'>';
  }

});

})();



(function() {

})();



(function() {
/**
A lightweight library for building and using touch gestures with Ember Applications

@module ember
@submodule ember-touch
@main ember-touch
*/

})();

