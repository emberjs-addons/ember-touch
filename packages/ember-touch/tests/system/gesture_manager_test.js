// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var application, view, touchEvent;


module("Gesture Manager",{
  setup: function() {
    application = Em.Application.create();
  },

  teardown: function() {
    application.destroy();
  }
});

test("manager should re-dispatch event to view", function() {

  var numViewStart = 0,
      numViewMove = 0, 
      numViewEnd = 0,
      numViewCancel = 0;

  var view = Em.View.create({
    touchStart: function(evt) {
      numViewStart++;            
    },
    touchMove: function(evt) {
      numViewMove++;            
    },
    touchEnd: function(evt) {
      numViewEnd++;            
    },
    touchCancel: function(evt) {
      numViewCancel++;            
    }
  });

  Em.run( function() {
     view.append(); 
  });

  touchEvent = new jQuery.Event('touchstart');
  view.$().trigger(touchEvent);

  touchEvent = new jQuery.Event('touchmove');
  view.$().trigger(touchEvent);

  touchEvent = new jQuery.Event('touchend');
  view.$().trigger(touchEvent);

  touchEvent = new jQuery.Event('touchcancel');
  view.$().trigger(touchEvent);

  equal(numViewStart,1,"dispatch start event to the view");
  equal(numViewMove,1,"dispatch move event to the view");
  equal(numViewEnd,1,"dispatch end event to the view");
  equal(numViewCancel,1,"dispatch cancel event to the view");

});

/*
test("TODO: manager should re-dispatch events to all gestures", function() {
 manager = Em.GestureManager.create({
      gestures: [
        gesture.create(),
        gesture.create()
      ]
    });
var numStart, numMove, numEnd, numCancel;
numStart = numMove = numEnd = numCancel = 0;
var manager = Em.GestureManager.create()

var gesture = Em.Object.extend({
  touchStart: function(evt, view, manager) {
    numStart++;
    if (view) manager.redispatchEventToView(view, 'touchstart')
  },
  touchMove: function(evt, view, manager) {
    numMove++;
    if (view) manager.redispatchEventToView(view, 'touchmove')
  },
  touchEnd: function(evt, view, manager) {
    numEnd++;
    if (view) manager.redispatchEventToView(view, 'touchend')
  },
  touchCancel: function(evt, view, manager) {
    numCancel++;
    if (view) manager.redispatchEventToView(view, 'touchcancel')
  }
});


});

*/
