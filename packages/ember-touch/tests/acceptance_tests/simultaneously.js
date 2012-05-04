var set = Em.set;
var get = Em.get;
var application;
var touchEvent;

var panStartWasCalled = false;
var panChangeWasCalled = false;
var panEndWasCalled = false;
var panCancelWasCalled = false;

var swipeStartWasCalled = false;
var swipeChangeWasCalled = false;
var swipeEndWasCalled = false;
var swipeCancelWasCalled = false;

var touchHoldEndWasCalled = false;

var touchHoldPeriod = 200;

module("Simultaneously Feature", {

  setup: function() {

    panStartWasCalled = false;
    panChangeWasCalled = false;
    panEndWasCalled = false;
    panCancelWasCalled = false;

    swipeStartWasCalled = false;
    swipeChangeWasCalled = false;
    swipeEndWasCalled = false;
    swipeCancelWasCalled = false;


    PanView = Em.View.extend({
      
      panOptions: {
        direction:  Em.GestureDirection.Horizontal,
        numberOfRequiredTouches: 1,
        initThreshold: 5,
      },

      panStart: function(recognizer) {
        panStartWasCalled = true;
      },

      panChange: function(recognizer) {
        panChangeWasCalled = true;
      },

      panEnd: function(recognizer) {
        panEndWasCalled = true;
      },

      panCancel: function(recognizer) {
        panCancelWasCalled = true;
      }

    });

    SwipeView =  Em.View.extend({

        swipeOptions: {
          numberOfRequiredTouches: 1,
          //simultaneously: false,
          direction:  Em.OneGestureDirection.Left | Em.OneGestureDirection.Right,
          cancelPeriod: 100,
          initThreshold: 5,
          swipeThreshold: 10
        },

        swipeStart: function(recognizer) {
          swipeStartWasCalled = true;
        },

        swipeChange: function(recognizer) {
          swipeChangeWasCalled = true;
        },

        swipeEnd: function(recognizer) {
          swipeEndWasCalled = true;
        },

        swipeCancel: function(recognizer) {
          swipeCancelWasCalled = true;
        }

      });

  },

  teardown: function() {
  }

});



test("With simultaneously enabled.", function() {
  
  application = Em.Application.create();

  var swipeView = SwipeView.create({
    swipeOptions: {
      simultaneously: true,
    }
  });

  var panView = PanView.create({
    panOptions: {
      simultaneously: true,
    }
  });

  Em.run(function() {
    swipeView.append();
    panView.append();
  });


  touchEvent = new jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [ {
      identifier: 0,
      pageX: 0,
      pageY: 0
    }]
  };
  panView.$().trigger( touchEvent );

  touchEvent = new jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 0
    }]
  };
  panView.$().trigger( touchEvent );


  equals(get(get(get(panView, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.BEGAN, "gesture should be began");
  ok( panStartWasCalled, 'pan Start Was called ');


  
  touchEvent = new jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [ {
      identifier: 0,
      pageX: 0,
      pageY: 0
    }]
  };
  swipeView.$().trigger( touchEvent );

  touchEvent = new jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 0
    }]
  };
  swipeView.$().trigger( touchEvent );

  ok( swipeStartWasCalled, ' all should be recognized ' );

  swipeView.destroy();
  panView.destroy();

  application.destroy();

  Em.AppGestureManager.restart();

});


test("Only one view can be recognized when simultaneously is disabled.", function() {
  

  application = Em.Application.create();
  var swipeView = SwipeView.create({
    swipeOptions: {
      simultaneously: false,
    }
  });

  var panView = PanView.create({
    panOptions: {
      simultaneously: false,
    }
  });

  Em.run(function() {
    swipeView.append();
    panView.append();
  });


  touchEvent = new jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [ {
      identifier: 0,
      pageX: 0,
      pageY: 0
    }]
  };
  panView.$().trigger( touchEvent );

  touchEvent = new jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 0
    }]
  };
  panView.$().trigger( touchEvent );


  ok( panStartWasCalled, 'pan Start Was called ');


  
  touchEvent = new jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [ {
      identifier: 0,
      pageX: 0,
      pageY: 0
    }]
  };
  swipeView.$().trigger( touchEvent );

  touchEvent = new jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 0
    }]
  };
  swipeView.$().trigger( touchEvent );

  ok( !swipeStartWasCalled, ' when simultaneously is disabled and a view is recognized, no other simultaneaously disable view can be recognized' );


  panView.unblockGestureRecognizer();

  // OJO: changed identifier
  touchEvent = new jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [ {
      identifier: 1,
      pageX: 0,
      pageY: 0
    }]
  };
  swipeView.$().trigger( touchEvent );

  touchEvent = new jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 1,
      pageX: 10,
      pageY: 0
    }]
  };
  swipeView.$().trigger( touchEvent );

  ok( swipeStartWasCalled, ' after unblockGestureRecognizer all should be working ok ' );

  panStartWasCalled = false;


  touchEvent = new jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [ {
      identifier: 1,
      pageX: 0,
      pageY: 0
    }]
  };
  panView.$().trigger( touchEvent );

  touchEvent = new jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 1,
      pageX: 10,
      pageY: 0
    }]
  };
  panView.$().trigger( touchEvent );

  ok( !panStartWasCalled, 'pan Start cannot be called ');

  swipeView.unblockGestureRecognizer();


  touchEvent = new jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [ {
      identifier: 2,
      pageX: 0,
      pageY: 0
    }]
  };
  panView.$().trigger( touchEvent );

  touchEvent = new jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 2,
      pageX: 10,
      pageY: 0
    }]
  };
  panView.$().trigger( touchEvent );
  ok( panStartWasCalled, 'pan Start was called after unblockGestureRecognizer ');



  swipeView.destroy();
  panView.destroy();
  application.destroy();

  Em.AppGestureManager.restart();
});



test("When unblock a view which did not block, throw exception", function() {
  

  application = Em.Application.create();
  var swipeView = SwipeView.create({
    swipeOptions: {
      simultaneously: false,
    }
  });

  var panView = PanView.create({
    panOptions: {
      simultaneously: false,
    }
  });

  Em.run(function() {
    swipeView.append();
    panView.append();
  });


  touchEvent = new jQuery.Event('touchstart');
  touchEvent['originalEvent'] = {
    targetTouches: [ {
      identifier: 0,
      pageX: 0,
      pageY: 0
    }]
  };
  panView.$().trigger( touchEvent );

  touchEvent = new jQuery.Event('touchmove');
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 0
    }]
  };
  panView.$().trigger( touchEvent );


  equals(get(get(get(panView, 'eventManager'), 'gestures')[0], 'state'),Em.Gesture.BEGAN, "gesture should be began");
  ok( panStartWasCalled, 'pan Start Was called ');


  raises(function() {
    swipeView.unblockGestureRecognizer();
  }, "swipe view did not block the gesture recognizer, that's why it cannot enable it.");

  panView.unblockGestureRecognizer();

  swipeView.destroy();
  panView.destroy();
  application.destroy();

  Em.AppGestureManager.restart();

});
