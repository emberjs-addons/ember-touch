var get = Em.get; var set = Em.set;

/**
  @module ember
  @submodule ember-touch
*/

/**
`Em.GestureManager` mainly acts as a composite for the multiple gesture
recognizers associated with a view.

This class is instantiated automatically by Em.View and it shouldn't be
directly accessed.

Whenever it gets a touch event, it relays it to the gestures when
coordination conditions are satisfied.

The other main resposibility of `Em.GestureManager` is to manage
event bubbling.

@class GestureManager
@namespace Ember
@extends Ember.Object
*/
Em.GestureManager = Em.Object.extend({

  /**
    An array containing all the gesture recognizers associated with a
    view. This is set automatically by `Em.View`.


    @property gestures
    @default null
    @type Array
  */
  gestures: null,

  /**
    @type Em.ApplicationGestureManager
    @property applicationGestureManager
  */
  //applicationGestureManager: null,

  applicationGestureManager: Ember.computed(function() {
    return this.view.get('container').lookup('gesture:application');
  }),

  container: null,

  /**
    The Em.View which belongs this `GestureManager` instance.

    @property view
    @type Em.View
  */
  view: null,

  /**
    Relays touchStart events to all the gesture recognizers to the
    specified view when coordination conditions are satisfied.

    @method touchStart
    @return Boolen
  */
  touchStart: function(evt, view) {
    return this._invokeEvent('touchStart',evt);
  },

  /**
    Relays touchMove events to all the gesture recognizers to the
    specified view when coordination conditions are satisfied.

    @method touchMove
    @return Boolen
  */
  touchMove: function(evt, view) {
    return this._invokeEvent('touchMove',evt);
  },

  /**
    Relays touchEnd events to all the gesture recognizers to the
    specified view when coordination conditions are satisfied.

    @method touchEnd
    @return Boolen
  */
  touchEnd: function(evt, view) {
    return this._invokeEvent('touchEnd',evt);
  },

  /**
    Relays touchCancel events to all the gesture recognizers to the
    specified view when coordination conditions are satisfied.

    @method touchCancel
    @return Boolen
  */
  touchCancel: function(evt, view) {
    return this._invokeEvent('touchCancel',evt);
  },

  /**
    Relays an event to the gesture recognizers. Used internally
    by the touch event listeners. Propagates the event to the parentViews.

    @private
    @method _invokeEvent
    @return Boolean
  */
  _invokeEvent: function(eventName, eventObject) {

    var gestures = this.get('gestures'),
        l =  gestures.length,
        handler,
        result = true;

    // view can response directly to touch events
    handler = this.view[eventName];
    if (Em.typeOf(handler) === 'function') {
      handler.call(this.view, eventObject);
    }


    var agm = this.get('applicationGestureManager'); 

    if ( !agm.get('isAllBlocked') ) {

      if ( l > 0 ) {

        //appGestureManager allow to pass touchEvents at the App Level
        var gesturesCanReceiveTouchEvent = agm.get('isBlocked')? agm.shouldReceiveTouch(this.view) : true;
        if ( gesturesCanReceiveTouchEvent ) {

          var gesture,
              gestureDelegate,
              isValid,
              i;

          for (i=0; i < l; i++) {
            gesture = gestures[i];
            handler = gesture[eventName];

            if (Em.typeOf(handler) === 'function') {

              gestureDelegate = gesture.get('delegate');

              if ( !gesture.get('isEnabled') ) {
                isValid = false;
              //gestureDelegate allow to pass touchEvents depending on gesture state
              } else if ( !gestureDelegate ) {
                isValid = true;
              } else {

                isValid = this._applyDelegateRules( gestureDelegate,  gesture, this.view, eventObject );
                if ( isValid === undefined ) {
                  isValid = gestureDelegate.shouldReceiveTouch( gesture, this.view, eventObject );
                }

              }

              if ( isValid ) {
                result = handler.call(gesture, eventObject);
              }

            }
          }

        }

      }

      // browser delivers the event to the DOM element
      // bubble the event to the parentView
      var parentView = this.view.get('parentView');
      if ( parentView ) {
        var manager = parentView.get('eventManager');
        if ( manager ) { manager._invokeEvent(eventName, eventObject); }
      }

    }

    return result;

  },

  /**
    Iterates all `GestureDelegateRule` instances of the gestureDelegate parameter
    executing its shouldReceiveTouch method and return the value whenever
    a rule respond with a defined value.

    @private
    @method _applyDelegateRules
    @return Boolean
  */
  _applyDelegateRules: function(gestureDelegate, gesture, view, event) {

    var rules = gestureDelegate.rules,
        length = rules.length;

    if ( length > 0 ) {

      var i,
          result;

      for (i=0;i<length;i++) {
        result = rules[i].shouldReceiveTouch(gesture, view, event);
        if ( result !== undefined ) {
          return result;
        }
      }
    }

    return undefined;

  }

});
