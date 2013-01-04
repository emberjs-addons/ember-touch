
/**
@module ember
@submodule ember-touch
*/
/**
GestureDelegate allows `GestureManager` instances decide
if a touch event can be dispatched to a view gesture.

Gestures can be set up using a `GestureDelegate` to coordinate
the gesture recognition based on application logic.

@class GestureDelegate
@namespace Ember
@extends Ember.Object
*/
Em.GestureDelegate = Em.Object.extend({

  /**
    Name of the gestureDelegate.
    This optional property can be used on gestureOptions
    to assign a gestureDelegate to a specific gesture.

    @property name
    @type Array
  */
  name: null,

  /**
    Array of `GestureDelegateRule` which can be setup
    with string path, extended classes or instances.
    In runtime, they are intented to be checked before
    `GestureDelegate.shouldReceiveTouch` call.

    @property rules
    @type Array
   */
  rules: null,

  init: function(){

    this._super();

    var rules = this.rules,
        current = [],
        rule;

    if ( !!rules ) {

      var i,
          max;

      for ( i=0, max=rules.length; i<max; i++ ) {

        rule = rules[i];

        if ( Em.typeOf(rule) === "string" ) {
          rule = Em.get(rule);
        }

        if ( !rule.isInstance ) {
          rule = rule.create();
        }

        current.push( rule );
      }

    }

    this.rules = current;

  },

  /**
    Respond if a gesture recognizer should receive a touch event.

    @method shouldReceiveTouch
    @return Boolen
  */
  shouldReceiveTouch: function(gesture, view, event) {
    return true;
  }

});
