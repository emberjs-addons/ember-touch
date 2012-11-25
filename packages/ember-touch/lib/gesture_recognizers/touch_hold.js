require('ember-touch/system/gesture');

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


