/**
  @class

  Allow any view to block the gesture recognition.

  When AppGestureManager isBlocked, gestureManager will call shouldReceiveTouch method 
  and when it returns false, it will deny passing touchEvents to view gestures. 

  @extends Em.Object
*/
Em.AppGestureManager = Em.Object.create({



  /*
  Assign the view which has blocked the recognizer, in order
  that view can be the only one which can unblock the recognizer. 
  */
  _blockerView: null,

  _isBlocked: false,
  _shouldReceiveTouchFn:null,
  


  isBlocked: Em.computed(function(){

    return this.get('_isBlocked');

  }).property('_isBlocked'),

  shouldReceiveTouch: function(view) {

    return this.get('_shouldReceiveTouchFn')(view);

  },

  /*  
   * shouldReceiveTouchFn function(view) which will be used to allow/deny passing touchEvents
   * to view gestures.
   */
  block: function( view, shouldReceiveTouchFn ) {

    if ( this.get('isBlocked') ) {
      throw new Error('manager has already blocked the gesture recognizer');
    }


    this.set('_shouldReceiveTouchFn', shouldReceiveTouchFn);
    this.set('_isBlocked', true);
    this.set('_blockerView', view);

  },

  unblock: function( view ) {

    if ( !this.get('isBlocked') ) {
      throw new Error('unblock, the gesture recognizer when the recognizer was not blocked. Did you unblock after Start? ');
    }

    var blockerView = this.get('_blockerView');

    if ( view !== blockerView ) {
      throw new Error('unblock a view which was not the one which blocked the gesture recognizer');
    }

    this.set('_isBlocked', false);
    this.set('_blockerView', null);
    this.set('_shouldReceiveTouchFn', null);

  }

});
