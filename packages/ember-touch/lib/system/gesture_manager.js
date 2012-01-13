// ==========================================================================
// Project:  Ember Touch 
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

require('ember-touch/system/gesture');
require('ember-touch/system/app_gesture_manager');

var get = Em.get;
var set = Em.set;

/**
  @class

  Manages multiplegesture recognizers that are associated with a view.
  This class is instantiated automatically by Em.View and you wouldn't
  interact with it yourself.

  Em.GestureManager mainly acts as a composite for the multiple gesture
  recognizers associated with a view. Whenever it gets a touch event, it
  relays it to the gestures. The other main resposibility of
  Em.GestureManager is to handle re-dispatching of events to the view.

  @extends Em.Object
*/
Em.GestureManager = Em.Object.extend({

  /**
    An array containing all the gesture recognizers associated with a
    view. This is set automatically by Em.View.

    @default null
    @type Array
  */
  gestures: null,
  view: null,

  /**
    Internal hash used to keep a list of the events that need to be
    re-dispatched to the views. It's used so we don't re-dispatch
    the same event multiple times to the same view.

    @default null
    @type Array
  */
  _redispatchQueue: null,

  _redispatchToNearestParentViewWaitingForTouches: function(evt) {
    var foundManager = null,
        successful = false;
    var view = get(this.view, 'parentView');

    while(view) {
      var manager = get(view, 'eventManager');

      if (manager !== undefined && manager !== null) {
        var gestures = get(manager, 'gestures');

        for (var i=0, l=gestures.length; i<l; i++) {

          if (get(gestures[i], 'state') === Em.Gesture.WAITING_FOR_TOUCHES) {
            foundManager = manager;
          }
        }

        if (foundManager) {
          successful = true;
          foundManager.touchStart(evt, view);
          break;
        }
      }
      
      view = get(view, 'parentView');
    }

    return successful;
  },

  /**
    Relays touchStart events to all the gesture recognizers to the
    specified view

    @return Boolen
  */
  touchStart: function(evt, view) {
    if (this._redispatchToNearestParentViewWaitingForTouches(evt)) {
      return;
    }

    return this._invokeEvent('touchStart',evt);
  },

  /**
    Relays touchMove events to all the gesture recognizers to the
    specified view

    @return Boolen
  */
  touchMove: function(evt, view) {
    return this._invokeEvent('touchMove',evt);
  },

  /**
    Relays touchEnd events to all the gesture recognizers to the
    specified view

    @return Boolen
  */
  touchEnd: function(evt, view) {
    return this._invokeEvent('touchEnd',evt);
  },

  /**
    Relays touchCancel events to all the gesture recognizers to the
    specified view

    @return Boolen
  */
  touchCancel: function(evt, view) {
    return this._invokeEvent('touchCancel',evt);
  },

  /**
    Relays an event to the gesture recognizers. Used internally
    by the touch event listeners.

    @private
    @return Boolean
  */
  _invokeEvent: function(eventName, eventObject) {

    var view = this.view;

    var gestures = get(this, 'gestures'),
        gesture, result = true, wasCalled = false;

    this._redispatchQueue = {};

    for (var i=0, l=gestures.length; i < l; i++) {
      gesture = gestures[i];
      handler = gesture[eventName];

      if (Em.typeOf(handler) === 'function') {
        result = handler.call(gesture, eventObject);
        wasCalled = true;
      }
    };

    if ( !wasCalled ) { // redispath the gesture to the parentView

      var parentView = get(view, 'parentView');
      if ( parentView ) {
        var manager = get(parentView, 'eventManager');

        if (manager !== undefined && manager !== null) {
          manager._invokeEvent(eventName, eventObject, parentView);
        }
        
      }
    }
    this._flushReDispatchQueue();
    return result;
  },

  /**
    Similar to _invokeEvent, but instead of invoking the event
    to the gesture recognizers, it re-dispatches the event to the
    view. This method is used by the gesture recognizers when they
    want to let the view respond to the original events.
  */
  redispatchEventToView: function(eventName, eventObject) {
    var queue = this._redispatchQueue;
    var view = this.view;

    if (queue[eventName] === undefined) {
      queue[eventName] = [];
    }
    else {
      var views = queue[eventName];

      for (var i=0, l=views.length; i<l; i++) {
        if (view === views[i].view) {
          return;
        }
      }
    }

    var originalEvent = null;
    if (eventObject && eventObject.originalEvent) originalEvent = eventObject.originalEvent;

    queue[eventName].push({
      view: view,
      originalEvent: originalEvent
    });
  },

  /**
    This method is used internally by _invokeEvent. It re-dispatches
    events to the view if the gestures decided they want to.
  */
  _flushReDispatchQueue: function() {
    var queue = this._redispatchQueue;

    for (var eventName in queue) {
      var views = queue[eventName];

      for (var i=0, l=views.length; i<l; i++) {
        var view = views[i].view;
        var event = jQuery.Event(eventName);

        event.originalEvent = views[i].originalEvent;

        // Trigger event so it bubbles up the hierarchy
        view.$().trigger(event, this);
      }
    }
  }

});
