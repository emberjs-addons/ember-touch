
require('ember-touch/system/gesture');

var get = Em.get;
var set = Em.set;

/**
  @class

  Recognizes a multi-touch press gesture. Press gestures 
  allow for a certain amount of wiggle-room between a start and end of a touch,
  and requires a minimum hold period to be triggered. 

  Presss are discrete gestures so only tapEnd() will get fired on a view.

    var myview = Em.View.create({
      elementId: 'gestureTest',
      
      pressEnd: function(recognizer) {

      }
    })

  You can specify how many touches the gesture requires to start using the numberOfRequiredTouches
  property, and a minimum pressPeriodThreshold which you can set in the pressHoldOptions hash:

    var myview = Em.View.create({
      pressOptions: {
        pressPeriodThreshold: 500
      }
      ...
    })


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

    return  isValidDistance && isValidHoldPeriod;

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

Em.Gestures.register('press', Em.PressGestureRecognizer);

