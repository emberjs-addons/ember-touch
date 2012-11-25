
require('ember-touch/system/gesture');

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
