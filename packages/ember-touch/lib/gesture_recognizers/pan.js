// ==========================================================================
// Project:  Ember Touch 
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

require('ember-touch/system/gesture');

var get = Em.get;
var set = Em.set;
var x = 0;

/**
  @class

  Recognizes a multi-touch pan gesture. Pan gestures require a specified number
  of fingers to move and will record and update the center point between the
  touches.

  For panChange events, the pan gesture recognizer includes a translation property
  which can be applied as a CSS transform directly. Translation values are hashes
  which contain an x and a y value.

    var myview = Em.View.create({
      elementId: 'gestureTest',
      
      panChange: function(rec) {
        var val = rec.get('translation');
        this.$().css({
          translateX: '%@=%@'.fmt((val.x < 0)? '-' : '+',Math.abs(val.x)),
          translateY: '%@=%@'.fmt((val.y < 0)? '-' : '+',Math.abs(val.y))
        });
      }
    })

  You can specify how many touches the gesture requires to start using the numberOfRequiredTouches
  property, which you can set in the panOptions hash:

    var myview = Em.View.create({
      panOptions: {
        numberOfRequiredTouches: 3
      }
      ...
    })

  @extends Em.Gesture
*/
Em.PanGestureRecognizer = Em.Gesture.extend({

  /**
    The translation value which represents the current amount of movement that has been applied
    to the view. You would normally apply this value directly to your element as a 3D
    transform.

    @type Location
  */
  translation: null,


  /**
    The pixel distance that the fingers need to move before this gesture is recognized.
    You should set up depending on your device factor and view behaviors.
    Distance is calculated separately on vertical and horizontal directions depending 
    on the direction property.

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

Em.Gestures.register('pan', Em.PanGestureRecognizer);
