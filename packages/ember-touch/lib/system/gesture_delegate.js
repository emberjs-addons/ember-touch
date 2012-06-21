// ==========================================================================
// Project:  Ember Touch 
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



/*
 Delegate implements the logic of your application's gesture-recognition behavior.
 Set up your gestures to use a GestureDelegate to coordinate the gesture recognition based 
 on the current status of your Application. 
 */
Em.GestureDelegate = Em.Object.extend({

  /*
  * Name of the gestureDelegate.
	* It will be used on gestureOptions to assign a gestureDelegate to a specific gesture.
  */
  name: null,
  /*
   * Rules can be setup with string path, extended classes or instances.
   * Rules are intented to be executed before shouldReceiveTouch method.
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
          rule = Em.getPath(rule);
        }

        if ( !rule.isInstance ) {
          rule = rule.create();
        }


        rule.gestureDelegate = this;
        current.push( rule );
      }

    }

    this.rules = current;

  },

	/*
  Ask the delegate if a gesture recognizer should receive a touch event.
  */
  shouldReceiveTouch: function(gesture, view, event) {
    return true; 
  }

});
