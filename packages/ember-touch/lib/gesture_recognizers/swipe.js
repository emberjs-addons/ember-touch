require('ember-touch/system/gesture');

var get = Em.get; var set = Em.set;

/**
  @class

  Recognizes a swipe gesture in one or more directions.

  Swipes are continuous gestures that will get fired on a view.

    var myview = Em.View.create({

      swipeStart: function(recognizer) {

      },
      swipeChange: function(recognizer) {

      },
      // usually, you will only use this method
      swipeEnd: function(recognizer) {

      },
      swipeCancel: function(recognizer) {

      }
    })

  SwipeGestureRecognizer recognizes a swipe when the touch has moved to a (direction) 
  far enough (swipeThreshold) in a period (cancelPeriod). 
  The current implementation will only recognize a direction on swipeEnd on (recognizer.swipeDirection).

    var myview = Em.View.create({
      swipeOptions: {
        direction: Em.SwipeGestureDirection.Left | Em.SwipeGestureDirection.Right,
        cancelPeriod: 100,
        swipeThreshold: 10
      }
      ...
    })

  @extends Em.Gesture
*/

Em.SwipeGestureDirection = {
  Right: 1,
  Left: 2, 
  Down: 4,
  Up: 8
}

Em.SwipeGestureRecognizer = Em.Gesture.extend({
  
  /**
    The period (ms) in which the gesture should have been recognized. 

    @private
    @type Number
  */
  cancelPeriod: 100,
  swipeThreshold: 50,

  direction: Em.SwipeGestureDirection.Right,

  //..................................................
  // Private Methods and Properties

  numberOfRequiredTouches: 1,
  swipeDirection: null,
  _initialLocation: null,
  _previousLocation: null,
  _cancelInterval: null,


  /**
    The pixel distance that the fingers need to move before this gesture is recognized.

    @private
    @type Number
  */
  _initThreshold: 5,


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

    var distance = Math.sqrt((x -= x0) * x + (y -= y0) * y);
    return distance >= this._initThreshold;
  },

  didBegin: function() {

    this._initialLocation = this.centerPointForTouches(get(this.touches,'touches'));

    var that = this;

    this._cancelInterval = window.setInterval( function() {
      that._cancelFired(that);
    }, this.cancelPeriod);

  },

  didChange: function() {

    var currentLocation = this.centerPointForTouches(get(this.touches,'touches'));
    var x = this._initialLocation.x;
    var y = this._initialLocation.y;

    var x0 = currentLocation.x;
    var y0 = currentLocation.y;

    var isValidMovement = false;

    if ( ( this.direction & Em.SwipeGestureDirection.Right ) != 0 ) {
      
      isValidMovement = ( (x0-x) > this.swipeThreshold);
      this.swipeDirection = Em.SwipeGestureDirection.Right; 

    } 
    if ( !isValidMovement && ( ( this.direction & Em.SwipeGestureDirection.Left ) != 0 ) ) {
      
      isValidMovement = ( (x-x0) > this.swipeThreshold);
      this.swipeDirection = Em.SwipeGestureDirection.Left; 

    } 
    if ( !isValidMovement && ( ( this.direction & Em.SwipeGestureDirection.Down ) != 0 ) ) {

      isValidMovement = ( (y0-y) > this.swipeThreshold);
      this.swipeDirection = Em.SwipeGestureDirection.Down; 

    } 
    if ( !isValidMovement && ( ( this.direction & Em.SwipeGestureDirection.Up ) != 0 ) ) {

      isValidMovement = ( (y-y0) > this.swipeThreshold);
      this.swipeDirection = Em.SwipeGestureDirection.Up; 

    }

    if ( isValidMovement ) {

      this._disableCancelFired();
      set(this, 'state', Em.Gesture.ENDED)

      var view = get(this, 'onBeganGestureView');
      var eventName = get(this, 'name')+'End';
      this.attemptGestureEventDelivery(view, eventName);
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

    var view = get(this, 'onBeganGestureView');
    var eventName = get(this, 'name')+'Cancel';
    this.attemptGestureEventDelivery(view, eventName);
    this._resetState(); 
    
  },

  _disableCancelFired: function() {

     window.clearInterval(this._cancelInterval);

  },

  toString: function() {
    return Em.SwipeGestureRecognizer+'<'+Em.guidFor(this)+'>';
  }

});

Em.Gestures.register('swipe', Em.SwipeGestureRecognizer);

