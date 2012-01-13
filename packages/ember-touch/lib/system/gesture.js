// ==========================================================================
// Project:  Ember Touch 
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

require('ember-touch/system/gestures');
require('ember-touch/system/gesture_manager');
require('ember-touch/system/touch_list');

var get = Em.get;
var set = Em.set;

var sigFigs = 100;

/**
  @class

  Base class for all gesture recognizers. Handles low-level touch and state
  management, and provides some utility methods and some required methods all
  gesture recognizers are expected to implement.

  ## Overview

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
        pinchStart: function(recognizer) {
          this.$().css('background','red');
        },

        pinchChange: function(recognizer) {
          var scale = recognizer.get('scale');
          this.$().css('scale',function(index, value) {
            return recognizer.get('scale') * value
          });
        },

        pinchEnd: function(recognizer) {
          this.$().css('background','blue');
        },

        pinchCancel: function(recognizer) {
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
  
  @extends Em.Object
*/



Em.Gesture = Em.Object.extend(
  /** @scope Em.Gesture.prototype */{

  /**
    The current state of the gesture recognizer. This value can be any one
    of the states defined at the end of this file.

    @type Number
  */
  state: null,

  /**
    A string of the gesture recognizer's name. This value is set automatically
    but Em.Gestures when a gesture is registered.

    @type String
  */
  name: null,

  /** 
    View in which the gesture must be recognized.
    Assigned on startup.
  */
  view: null,
  
  /** 
    Specifies whether a gesture is discrete or continuous.

    @type Boolean
    @default false
  */
  gestureIsDiscrete: false,


  preventDefaultOnChange: false,


  /**
    When true is guaranteed to allow simultaneous recognition. When false, the gesture  
    should not be recognized when there is other active gesture whose simultaneously is disabled.

    @type Boolean
    @default true
  */
  simultaneously: true,

  appGestureManager:null,

  /** 
    You can use the `touches` protected property to access the touches hash. The touches 
    hash is keyed on the identifiers of the touches, and the values are the jQuery.Event 
    objects.

    @private 
    @type Hash
  */
  touches: null,

  /** 
    You can also use the numberOfActiveTouches property to inspect how many touches
    are active, this is mostly useful in shouldBegin since every other callback can
    assume that there are as many active touches as specified in the 
    numberOfRequiredTouches property.

    @private 
    @type Number
  */
  numberOfActiveTouches: 0,

  /** 
    Used to specify the number of touches required for the gesture to enter a possible 
    state

    @private 
    @type Number
  */
  numberOfRequiredTouches: 1,

  /** 
    View which received the event to trigger the Em.Gesture.BEGAN state.

    @type Em.View
  */

  init: function() {
    this._super();
    this.touches = Em.TouchList.create();
  },

  //..............................................
  // Gesture Callbacks

  /** @private */
  didBecomePossible: function() { },



  /** @private */
  shouldBegin: function() {
    return true;
  },

  /** @private */
  didBegin: function() { },

  /** @private */
  didChange: function() { },

  /** @private */
  eventWasRejected: function() { },

  /** @private */
  shouldEnd: function() {
    return true;
  },

  /** @private */
  didEnd: function() { },

  /** @private */
  didCancel: function() { },

  //..............................................
  // Utilities

  /** @private */


  simultaneouslyAllowed: function() {

    var result = true;

    if ( !this.simultaneously ) {

      if ( !this.manager.appGestureManager.get('isBlocked') ) {

        this.manager.appGestureManager.block(this.view); 

      } else {

        // normally, when blocked it must return false. 
        // But it could find the case, in which, the gesture did not unblock 
        // ( cause of missing events/ or code developer ). 
        // on this case, i want the same view can recognize again the gesture
        
        result = this.manager.appGestureManager.wasBlockedBy(this.view); 
      }

    }
    return result;
  },
  
  /**
    Notify the View of the event and trigger eventWasRejected if the view don't implement the API 
    or return false

  */
  attemptGestureEventDelivery: function(eventName) {

    var wasNotified =  this.notifyViewOfGestureEvent(eventName);
    if ( !wasNotified ) {
      this.eventWasRejected();
    }             

  },

  /**
    Given two Touch objects, this method returns the distance between them.

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

  /** @private */
  _objectValues: function(object) {
    var ret = [];

    for (var item in object ) {
      if (object.hasOwnProperty(item)) {
        ret.push(object[item]);
      }
    }

    return ret;
  },

  /**
    Allows the gesture to notify the view it's associated with of a gesture
    event.

    @private
  */
  notifyViewOfGestureEvent: function(eventName, data) {
    var handler = this.view[eventName];
    var result = false;

    if (Em.typeOf(handler) === 'function') {
      result = handler.call(this.view, this, data);
    }

    return result;
  },

  toString: function() {
    return Em.Gesture+'<'+Em.guidFor(this)+'>';
  },

  /** @private */
  _resetState: function() {
    this.touches.removeAllTouches();
  },

  //..............................................
  // Touch event handlers

  /** @private */
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
        if (this.shouldBegin() && this.simultaneouslyAllowed()  ) {
          set(this, 'state', Em.Gesture.BEGAN);
          this.didBegin();
        }

      } else {
        set(this, 'state', Em.Gesture.POSSIBLE);
        this.didBecomePossible();
      }
    }

    this.manager.redispatchEventToView('touchstart', evt);
  },

  /** @private */
  touchMove: function(evt) {
    var state = get(this, 'state');

    if (state === Em.Gesture.WAITING_FOR_TOUCHES || state === Em.Gesture.ENDED || state === Em.Gesture.CANCELLED) {

      // Nothing to do here
      this.manager.redispatchEventToView('touchmove', evt);
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

      if (this.shouldBegin() && this.simultaneouslyAllowed()  ) {

        set(this, 'state', Em.Gesture.BEGAN);
        this.didBegin();

        // Give the gesture a chance to update its state so the view can get 
        // updated information in the Start event 
        this.didChange();

        if ( this.preventDefaultOnChange ) {
          evt.preventDefault();
        }

        this.attemptGestureEventDelivery(get(this, 'name')+'Start');
      }

    } else if (state === Em.Gesture.BEGAN || state === Em.Gesture.CHANGED)  {

      set(this, 'state', Em.Gesture.CHANGED);
      this.didChange();

      if ( this.preventDefaultOnChange ) {
        evt.preventDefault();
      }

      // Discrete gestures don't fire changed events
      if ( !this.gestureIsDiscrete ) {

        this.attemptGestureEventDelivery( get(this, 'name')+'Change');

      }

    }

    this.manager.redispatchEventToView('touchmove', evt);

  },

  /** @private */
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
        // Discrete gestures need to cancel if they shouldn't end successfully
        if ( this.shouldEnd() ) {

          set(this, 'state', Em.Gesture.ENDED);
          this.didEnd();
          this.attemptGestureEventDelivery( get(this, 'name')+'End');

        } else {

          set(this, 'state', Em.Gesture.CANCELLED);
          this.didCancel();

        }
      }

    }  else {

      if ( state === Em.Gesture.BEGAN || state === Em.Gesture.CHANGED ) {

        if ( this.shouldEnd() ) {


          set(this, 'state', Em.Gesture.ENDED);
          this.didEnd();

          this.attemptGestureEventDelivery( get(this, 'name')+'End');

        }

      }

    }


    this.manager.redispatchEventToView('touchend', evt);

    this._resetState();
  },

  /** @private */
  touchCancel: function(evt) {
    var state = get(this, 'state');

    if ( state !== Em.Gesture.CANCELLED) {

      set(this, 'state', Em.Gesture.CANCELLED);
      this.didCancel();

      if ( !this.gestureIsDiscrete ) {
        this.notifyViewOfGestureEvent( get(this, 'name')+'Cancel');
      }

    } else {
      this.manager.redispatchEventToView('touchcancel', evt);
    }

    this._resetState();

  },

  /*  debug Utils */
  /*
  _stateChanged: Em.observer(function(){
    var state = get(this, 'state');
    console.log( this.toString() + ' ' + this._stateToString( state ) ); 
  }, 'state'),
  */
  _stateToString: function(state) {

    var result = 'NONE';
    switch (state ) {
        case Em.Gesture.WAITING_FOR_TOUCHES:
            result = 'WAITING_FOR_TOUCHES';
            break;
        case Em.Gesture.POSSIBLE:
            result = 'POSSIBLE';
            break;
        case Em.Gesture.BEGAN:
            result = 'BEGAN';
            break;
        case Em.Gesture.CHANGED:
            result = 'CHANGED';
            break;
        case Em.Gesture.ENDED:
            result = 'ENDED';
            break;
        case Em.Gesture.CANCELLED:
            result = 'CANCELLED';
            break;
    }

    return result;

  }


});

Em.GestureDirection = {
  Vertical: 1,
  Horizontal: 2
}


Em.OneGestureDirection = {
  Right: 1,
  Left: 2, 
  Down: 4,
  Up: 8
}

Em.Gesture.WAITING_FOR_TOUCHES = 0;
Em.Gesture.POSSIBLE = 1; // only continuous
Em.Gesture.BEGAN = 2;
Em.Gesture.CHANGED = 3; 
Em.Gesture.ENDED = 4;
Em.Gesture.CANCELLED = 5;

//TODO: 
//- think about multiple events handling at the same time currentEventObject
//- check meaning of manager.redispatEventToView
//- emberjs.event_manager. dispatchEvent should pass the view? I think is not necesary cause of the view has its own manager, 
//  so manager should have assigned its view.
//  testing directions on pan and swipe gestures
//  LifeCycle of Em.AppGestureManager
