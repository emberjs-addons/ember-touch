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

    /* Taking mouseDown, mouseMove, mouseLeave and mouseUp events and mapping them to
     *   touchStart, touchMove, touchEnd events.
     * Add the necessary properties to the event object for click and make it look
     *   like touch event object. Then give it to Em.Gesture.
     * Refer http://goo.gl/GmQg4K to know more about touch event object.
     *   */
    /**
     Relays mouseDown as touchStart events to all the gesture recognizers to the
     specified view

     @return Boolen
     */
    mouseDown: function(evt, view) {
        /* Set _currentEventProperties to the view to track down the mouse events.
         *  1. mouseDown followed by mouseMove can only be considered as touchMove
         *  2. targetTouches can only be filled if mouseDown and mouseUp have occurred on the same target
         *  */
        var currentEventProp = {
            "savedTarget": evt.target,
            "isTouchStarted": true
        };
        view.set("_currentEventProperties", currentEventProp);

        evt = this._convertToTouchObj(evt, view);
        return this._invokeEvent('touchStart',evt);
    },

    /**
     Relays mouseMove as touchMove events to all the gesture recognizers to the
     specified view

     @return Boolen
     */
    mouseMove: function(evt, view) {
        var currentEventProp = view.get("_currentEventProperties");
        // Check if mouseDown event has already been fired in the view and invoke touchMove
        if(typeof currentEventProp !== "undefined" && currentEventProp.isTouchStarted) {
            evt = this._convertToTouchObj(evt, view);
            return this._invokeEvent('touchMove', evt);
        } else {
            // Do nothing when mouse just hovers on an element
            return;
        }
    },

    /**
     Relays mouseLeave as touchEnd event to all the gesture recognizers to the
     specified view
     NOTE: mouseLeave should actually be mapped to touchCancel.
     Doing so since we have not handled touchCancel anywhere in our views

     @return Boolen
     */
    mouseLeave: function(evt, view) {
        evt = this._convertToTouchObj(evt, view);
        // Clear _currentEventProperties of the view
        var currentEventProp = {
            "savedTarget": '',
            "isTouchStarted": false
        };
        view.set("_currentEventProperties", currentEventProp);

        return this._invokeEvent('touchEnd', evt);
    },

    /**
     Relays mouseUp as touchEnd events to all the gesture recognizers to the
     specified view

     @return Boolen
     */
    mouseUp: function(evt, view) {
        evt = this._convertToTouchObj(evt, view);
        // Clear _currentEventProperties of the view
        var currentEventProp = {
            "savedTarget": '',
            "isTouchStarted": false
        };
        view.set("_currentEventProperties", currentEventProp);

        return this._invokeEvent('touchEnd',evt);
    },

    /** Converts click event object into touch event object by adding
     *   the most needed properties like touches, changedTouches and targetTouches
     *  Each of these would have clientX, clientY, identifier, pageX, pageY, screenX, screenY, target
     *  targetTouches will have the event object only if the mouse is in the same target element
     *   from mouseDown through mouseUp
     *  @param   Object  evt Event object of click
     *  @param   Object  view    Target view. Used to check mouseDown target
     *  @return  Object  (touch event object) modified event object
     */
    _convertToTouchObj: function(evt, view) {
        var touches = [], targetTouches = [];
        touches[0] = {
            clientX: evt.clientX,
            clientY: evt.clientY,
            identifier: 0,
            pageX: evt.pageX,
            pageY: evt.pageY,
            screenX: evt.screenX,
            screenY: evt.screenY,
            target: evt.target
        };

        if(evt.target === view.getPath("_currentEventProperties.savedTarget")) {
            // Check if the target element is the same element as in mouseDown
            targetTouches = touches;
        }
        evt.originalEvent.touches = evt.originalEvent.changedTouches = touches;
        evt.originalEvent.targetTouches = targetTouches;

        return evt;
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
