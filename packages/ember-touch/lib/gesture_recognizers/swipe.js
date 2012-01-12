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
        direction: Em.OneGestureDirection.Left | Em.OneGestureDirection.Right,
        cancelPeriod: 100,
        swipeThreshold: 10
      }
      ...
    })

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
    You should set up depending on your device factor and view behaviors.
    Distance is calculated separately on vertical and horizontal directions depending 
    on the direction property.
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
    The pixel distance that the fingers need to move before this gesture is recognized.

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

  didChange: function() {

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
      set(this, 'state', Em.Gesture.ENDED)

      var eventName = get(this, 'name')+'End';
      this.attemptGestureEventDelivery(eventName);
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

    var eventName = get(this, 'name')+'Cancel';
    this.attemptGestureEventDelivery(eventName);
    this._resetState(); 
    
  },

  _disableCancelFired: function() {

     window.clearTimeout( this._cancelTimeout );

  },

  toString: function() {
    return Em.SwipeGestureRecognizer+'<'+Em.guidFor(this)+'>';
  }

});

Em.Gestures.register('swipe', Em.SwipeGestureRecognizer);

