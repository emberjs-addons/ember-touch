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
  filters: null,

  init: function(){

    this._super();

    var filters = this.filters,
        current = [],
        filter;

    if ( !!filters ) {

      var i,
          max;
      
      for ( i=0, max=filters.length; i<max; i++ ) {

        filter = filters[i];

        if ( Em.typeOf(filter) === "string" ) {
          filter = Em.getPath(filter);
        }

        if ( !filter.isInstance ) {
          filter = filter.create();
        }


        filter.gestureDelegate = this;
        current.push( filter );
      }

    }

    this.filters = current;

  },

	/*
  Ask the delegate if a gesture recognizer should receive a touch event.
  */
  shouldReceiveTouch: function(gesture, view, event) {
    return true; 
  }

});
