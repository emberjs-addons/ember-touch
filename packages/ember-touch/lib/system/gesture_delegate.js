// ==========================================================================
// Project:  Ember Touch 
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


require('ember-touch/system/gesture_delegates');


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

  init: function(){
    this._super();
  },

	/*
  Ask the delegate if a gesture recognizer should receive a touch event.
  */
  shouldReceiveTouch: function(gesture, view, event) {
    return true; 
  }


});

