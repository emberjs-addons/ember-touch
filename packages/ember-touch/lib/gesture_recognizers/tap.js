require('ember-touch/system/gesture');

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
