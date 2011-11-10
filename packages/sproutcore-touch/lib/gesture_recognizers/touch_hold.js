require('sproutcore-touch/system/gesture');

var get = SC.get;
var set = SC.set;

/**
  @class

  Recognizes a multi-touch touch and hold gesture. Touch and Hold gestures 
  allow move the finger on the same view, and after the user leaves its finger 
  motionless during a specific period the end view event is automatically triggered. 

  TouchHold are discrete gestures so only touchHoldEnd() will get fired on a view.

    var myview = SC.View.create({
      elementId: 'gestureTest',
      
      touchHoldEnd: function(recognizer) {

      }
    })

  You can specify how many touches the gesture requires to start using the numberOfRequiredTouches
  property, a minimum "period" the finger must be held to automatically trigger the end event 
  and "moveThreshold" which allows to move the finger a specific number of pixels

    var myview = SC.View.create({
      touchHoldOptions: {
        holdPeriod: 500,
        moveThreshold: 10
      }
      ...
    })


  @extends SC.Gesture
*/
SC.TouchHoldGestureRecognizer = SC.Gesture.extend({

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
  //gestureIsDiscrete: false,
  

  _endInterval: null,

  _targetElement: null,


  shouldBegin: function() {
    return get(this.touches,'length') === get(this, 'numberOfRequiredTouches');
  },

  didBegin: function() {

    this._initialLocation = this.centerPointForTouches(get(this.touches,'touches'));

    var target = get(this.touches,'touches')[0].target;
    set(this,'_target', target ); 

    var that = this;
    this._endInterval = window.setInterval( function() {

      that._endFired(that);

    }, this.holdPeriod);

  },

  didDiscreteChange: function() {

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
      set(this, 'state', SC.Gesture.CANCELLED);

      //this._resetState(); // let be executed on touchEnd
    }

  },

  // when a touchend event was fired ( cause of removed finger )
  // disable interval action trigger and block end state
  // this event is responsable for gesture cancel
  shouldEnd: function() {
    
    this._disableEndFired();

    return  false;

  },

  _endFired: function() {

    this._disableEndFired();
    
    if ( this.state === SC.Gesture.BEGAN ) {

      set(this, 'state', SC.Gesture.ENDED)

      var view = get(this, 'onBeganGestureView');
      var eventName = get(this, 'name')+'End';

      this.attemptGestureEventDelivery(undefined, view, eventName, undefined);

      //this._resetState(); // let be executed on touchEnd
      
    }

  },

  _disableEndFired: function() {

     window.clearInterval(this._endInterval);

  },

  toString: function() {
    return SC.TouchHoldGestureRecognizer+'<'+SC.guidFor(this)+'>';
  }

});

SC.Gestures.register('touchHold', SC.TouchHoldGestureRecognizer);

