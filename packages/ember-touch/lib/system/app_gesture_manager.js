
/**
  @class

  Manage the states of no-simulataneosly views. 

  TODO: 
    - the initialization/destroy process must be improved.
    suggested based on Application cycle. 

  @extends Em.Object
*/
Em.AppGestureManager = Em.Object.create({

  _isBlocked: false,


  /*
  Assign the view which has blocked the recognizer, in order
  that view can be the only one which can unblock the recognizer. 
  */
  _blockerView: null,


  isBlocked: Em.computed(function(){

    return this.get('_isBlocked');

  }).property('_isBlocked'),

  wasBlockedBy: function ( view ) {

    return view === this.get('_blockerView');

  },


  block: function( view ) {

    if ( this.get('isBlocked') ) {
      throw Error('manager has already blocked the gesture recognizer');
    }


    if (  view.get('simultaneosly') ) {
      // ember_assert
      throw Error('a view with simultaneosly property true, cannot block the gesture recognizer');
    }

    this.set('_isBlocked', true);
    this.set('_blockerView', view);

  },

  unblock: function( view ) {

    if ( !this.get('isBlocked') ) {
      throw Error('unblock, the gesture recognizer when the recognizer was not blocked. Did you unblock after Start? ');
    }

    if (  view.get('simultaneosly') ) { // ember_assert
      throw Error('a view with simultaneosly property true, cannot unblock the gesture recognizer');
    }

    var blockerView = this.get('_blockerView');

    if ( view !== blockerView ) {
      throw Error('unblock a view which was not the one which blocked the gesture recognizer');
    }
    this.set('_isBlocked', false);

  },

  restart: function() {

    this.set('_isBlocked', false);
    this.set('_blockerView', null);

  }

});
