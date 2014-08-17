require('ember-touch/system/gesture');

var get = Em.get, set = Em.set;

/**
 @module ember
 @submodule ember-touch
 */
/**
 Recognizes a rotate gesture. Rotations are continuous gestures that will get fired on a view. The rotation gesture
 tracks the changes in the angle between two fingers.

 var myview = Em.View.create({

  rotateStart: function(recognizer, evt) {

  },
  // usually, you will only use this method
  rotateChange: function(recognizer, evt) {
    var rotationDegrees = recognizer.get('rotationDegrees'), // total rotation in degrees since gesture start
      rotation = recognizer.get('rotation'), // total rotation in radians since gesture start
      deltaDegrees = recognizer.get('deltaDegrees'), // rotation in degrees since previous call to rotateChange
      delta = recognizer.get('delta'); // rotation in radians since previous call to rotateChange

    this.$().css('rotation', rotationDegrees + 'deg');
  },
  rotateEnd: function(recognizer, evt) {

  },
  rotateCancel: function(recognizer, evt) {

  }
});

 @class RotateGestureRecognizer
 @namespace Ember
 @extends Em.Gesture
 */

Em.RotateGestureRecognizer = Em.Gesture.extend({
  /**
    total rotation in radians since gesture start

    @type Number
  */
  rotation: 0,

  /**
    total rotation in degrees since gesture start

    @type Number
  */
  rotationDegrees: 0,

  /**
   rotation in radians since previous call to rotateChange

   @type Number
  */
  delta: 0,

  /**
   rotation in radians since previous call to rotateChange

   @type Number
  */
  deltaDegrees: 0,

  numberOfRequiredTouches: 2,

  /**
   @private
  */
  DEGREES_PER_RADIAN: 180 / Math.PI,

  /**
   @private
  */
  startAngle: 0,
  /**
   @private
  */
  previousAngle: 0,
  /**
   @private
  */
  previousDelta: 0,

  /**
   @private
  */
  angle: 0,


  didBecomePossible: function () {
    var angle = this.angleBetweenTouches();

    set(this, 'startAngle', angle);
    set(this, 'angle', angle);
    set(this, 'previousAngle', angle);
    set(this, 'previousDelta', 0);
    set(this, 'delta', 0);

    this.updateAngles(this.angleBetweenTouches());
  },
  shouldBegin: function () {
    return true;
  },
  didChange: function () {
    this.updateAngles(this.angleBetweenTouches());
  },
  eventWasRejected: function () {
    var previousDelta = get(this, 'previousDelta'),
      previousAngle = get(this, 'previousAngle');

    this.updateAngles(previousAngle);

    set(this, 'delta', previousDelta);
    set(this, 'deltaDegrees', previousDelta * this.DEGREES_PER_RADIAN);
  },
  angleBetweenTouches: function () {
    var touches = get(this.touches, 'touches'),
      dx = touches[1].pageX - touches[0].pageX,
      dy = touches[1].pageY - touches[0].pageY;

    return Math.atan2(dy, dx);
  },
  updateAngles: function (angle) {
    var startAngle = get(this, 'startAngle'),
      previousAngle = get(this, 'angle'),
      previousDelta = get(this, 'delta'),
      rotation = startAngle - angle,
      delta = previousAngle - angle;

    set(this, 'previousAngle', previousAngle);
    set(this, 'previousDelta', previousDelta);
    set(this, 'angle', angle);
    set(this, 'rotation', rotation);
    set(this, 'rotationDegrees', rotation * this.DEGREES_PER_RADIAN);
    set(this, 'delta', delta);
    set(this, 'deltaDegrees', delta * this.DEGREES_PER_RADIAN);
  },
  toString: function () {
    return Em.RotateGestureRecognizer + '<' + Em.guidFor(this) + '>';
  }
});

