var get = Em.get, set = Em.set;

/**
@module ember
@submodule ember-touch
*/

/**
Base class for all gesture recognizers. Handles low-level touch and state
management, and provides some utility methods and some required methods all
gesture recognizers are expected to implement.

# Overview

Gestures coalesce multiple touch events to a single higher-level gesture
event. For example, a tap gesture recognizer takes information about a
touchstart event, a few touchmove events, and a touchend event and uses
some heuristics to decide whether or not that sequence of events qualifies
as a tap event. If it does, then it will notify the view of the higher-level
tap events.

Gesture events follow the format:

  * *[GESTURE_NAME]* Start - Sent when a gesture has gathered enough information
      to begin tracking the gesture

  * *[GESTURE_NAME]* Change - Sent when a gesture has already started and has
      received touchmove events that cause its state to change

  * *[GESTURE_NAME]* End - Sent when a touchend event is received and the gesture
      recognizer decides that the gesture is finished.

  * *[GESTURE_NAME]* Cancel - Sent when a touchcancel event is received.

There are two types of gestures: Discrete and Continuous gestures. In contrast
to continuous gestures, discrete gestures don't have any change events. Rather,
the end event is the only one that gets sent to the view.

## Usage

While you wouldn't use Em.Gesture directly, all its subclasses implement the 
same API. For example, to implement pinch on a view, you implement one or more 
of the pinch events. For example:

    var myView = Em.View.create({
      pinchStart: function(recognizer, evt) {
        this.$().css('background','red');
      },

      pinchChange: function(recognizer, evt) {
        var scale = recognizer.get('scale');
        this.$().css('scale',function(index, value) {
          return recognizer.get('scale') * value
        });
      },

      pinchEnd: function(recognizer, evt) {
        this.$().css('background','blue');
      },

      pinchCancel: function(recognizer, evt) {
        this.$().css('background','blue');
      }
    });

pinchStart(), pinchEnd() and pinchCancel() will only get called once per
gesture, but pinchChange() will get called repeatedly called every time
one of the touches moves.

## Customizing Gesture Recognizers

Some of the gesture recognizers include properties that can be customized by 
the user for a specific instance of a view. For example, a pan gesture defaults 
to being a one-finger gesture, but in some scenarios, it must be defined as a 
two-finger gesture. In that case, you can override defaults by specifying an 
Options hash. 

    var myView = Em.View.create({
      panOptions: {
        numberOfRequiredTouches: 2
      }
    });      

## Creating Custom Gesture Recognizers

Em.Gesture also defines an API which its subclasses can implement to build
custom gestures. The methods are:

  * **didBecomePossible** - Called when a gesture enters a possible state. This
      means the gesture recognizer has accepted enough touches to match 
      the number of required touches. You would usually initialize your state
      in this callback.

  * **eventWasRejected** - Called if a view returns false from a gesture event.
      This callback allows you to reset internal state if the user rejects
      an event.

  * **shouldBegin** - Allows a gesture to block itself from entering a began state.
      This callback will continuously be called as touches move until it begins.

  * **shouldEnd** - Allows a gesture to block itself from entering an ended state.
      This callback gets called whenever a tracked touch gets a touchEnd event.

  * **didBegin** - Called when the gesture enters a began state. Called before the
     view receives the Start event on continuous gestures.

  * **didChange** - Called when the gesture enters a changed state, and when one of the
      touches moves. Called before the view receives the Change event on continuos gestures.

  * **didEnd** - Called when the gesture enters an ended state. Called before the
     view receives the End event.

  * **didCancel** - Called when the gesture enters a cancelled state. Called before the
     view receives the Cancel event on continuos gestures.

In all the callbacks, you can use the `touches` protected property to access the
touches hash. The touches hash is keyed on the identifiers of the touches, and the
values are the jQuery.Event objects. You can also access the length property to inspect 
how many touches are active, this is mostly useful in shouldBegin since every other 
callback can assume that there are as many active touches as specified in the 
numberOfRequiredTouches property.

## Discrete vs Continuous Gestures

There are two main classes of gesture recognizers: Discrete and Continuous 
gestures. Discrete gestures do not get Start, Change nor Cancel events sent, 
since they represent a single, instantaneous event, rather than a continuous 
motion. If you are implementing your own discrete gesture recognizer, you must 
set the gestureIsDiscrete property to yes, and Em.Gesture will adapt its behavior.

Discrete gestures use the shouldEnd callback to either accept or decline the gesture
event. If it is declined, then the gesture will enter a Cancelled state.

  @class Gesture
  @namespace Ember
  @extends Ember.Object
*/
Em.Gesture = Em.Object.extend({

  /**
    The current state of the gesture recognizer. This value can be any one
    of the states defined at the end of this file.

    @property state
    @type Number
  */
  state: null,

  /**
    A string of the gesture recognizer's name. This value is set automatically
    but Em.Gestures when a gesture is registered.

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
  applicationGestureManager: null,
  
  /** 
    Specifies whether a gesture is discrete or continuous.

    @property gestureIsDiscrete
    @type Boolean
    @default false
  */
  gestureIsDiscrete: false,


  /**
    When true is guaranteed to allow simultaneous recognition. When false, the gesture  
    should not be recognized when there is other active gesture whose simultaneously is disabled.

    @property simultaneously
    @type Boolean
    @default true
  */
  simultaneously: true,

	/**
    Used to assign a gesture delegate on init process.

    @property delegateName
    @type String
  */
  delegateName: null,
 
  /**	
    Apply a delegate to customize an application's gesture-recognition behavior. 

    @property delegate
    @type Em.GestureDelegate
  */
  delegate: null, 

  /**
    Use this property to disable gesture recognition. 
    Use isEnabledBinding to global or view properties.

    @property isEnabled
    @type Boolean
    @default true
  */
  isEnabled: true,


  /** 
    You can use the `touches` protected property to access the touches hash. The touches 
    hash is keyed on the identifiers of the touches, and the values are the jQuery.Event 
    objects.

    @private 
    @property touches
    @type Hash
  */
  touches: null,

  /** 
    You can also use the numberOfActiveTouches property to inspect how many touches
    are active, this is mostly useful in shouldBegin since every other callback can
    assume that there are as many active touches as specified in the 
    numberOfRequiredTouches property.

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

      var delegates = get(get(this, 'applicationGestureManager'), 'delegates');

      delegate = delegates.find(delegateName);
      Em.assert('empty delegate, attempting to set up delegate based on delegateName', delegate);
      set(this, 'delegate', delegate);

    }

  },

  //..............................................
  // Gesture Protected Methods

  /** 
    @protected 
    @method didBecomePossible
  */
  didBecomePossible: function() { },

  /** 
    @protected 
    @method shouldBegin
  */
  shouldBegin: function() {
    return true;
  },

  /** 
    @protected 
    @method didBegin
  */
  didBegin: function() { },

  /** 
    @protected 
    @method didChange
  */
  didChange: function(evt) { },

  /** 
    @protected 
    @method eventWasRejected
  */
  eventWasRejected: function() { },

  /** 
    @protected 
    @method shouldEnd
  */
  shouldEnd: function() {
    return true;
  },

  /** 
    @protected 
    @method didEnd
  */
  didEnd: function() { },

  /** 
    @protected 
    @method didCancel
  */
  didCancel: function() { },

  //..............................................
  // Utilities

  /** @private */


  /**
   Block AppGestureManager, if simultaneously is true.
    @private 
    @method blockApplicationGestureManagerIfSimultaneously
   */
  blockApplicationGestureManagerIfSimultaneously: function() {

    if ( !this.simultaneously ) {

      var allowedView = this.view;

      this.applicationGestureManager.block(this.view, function(v) {
        return allowedView === v;
      }); 

    }

  },
  
  /**
    Notify the View of the event and trigger eventWasRejected if the view doesn't implement the API 
    or return false
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
    Given two Touch objects, this method returns the midpoint between them.

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
    Allows the gesture to notify the view it's associated with of a gesture
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
    @private 
    @method _resetState
  */
  _resetState: function() {
    this.touches.removeAllTouches();
  },

  //..............................................
  // Touch event handlers
  
  /** 
    Handles touchStart events.
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
          // restart touches, otherwise a gesture could state on possible state forever 
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
    Handles touchMove events.
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
    Handles touchEnd events.
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

    if ( this.gestureIsDiscrete ) {

      if ( state === Em.Gesture.BEGAN || state === Em.Gesture.CHANGED ) {


        // Discrete gestures use shouldEnd to either accept or decline the gesture.
        if ( this.shouldEnd() ) {

          set(this, 'state', Em.Gesture.ENDED);
          this.didEnd();
          this.attemptGestureEventDelivery(this.name+'End', evt);

        }  

      }

    }  else {

      if ( state === Em.Gesture.BEGAN || state === Em.Gesture.CHANGED ) {

        if ( this.shouldEnd() ) {


          set(this, 'state', Em.Gesture.ENDED);
          this.didEnd();

          this.attemptGestureEventDelivery(this.name+'End', evt);

        }

      }

    }

    this._resetState();
  },

  /** 
    Handles touchCancel events.
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
