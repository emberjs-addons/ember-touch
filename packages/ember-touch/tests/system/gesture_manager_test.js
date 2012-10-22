// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set = Em.set;
var get = Em.get;
var application, view, touchEvent, gestures;


module("Gesture Manager",{
  setup: function() {
    application = Em.Application.create({
      ready: function() {
        start();
      }
    });
    stop();
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


test("manager avoid delivering events when isAllBlocked is true", function() {

    var endCalled;
    var view = Em.View.create({
      
      tapOptions: {
        numberOfRequiredTouches: 1
      },

      tapEnd: function(recognizer) {
        endCalled = true;
      }

    });


    endCalled = false;


    Em.AppGestureManager.set('isAllBlocked', true);

    Em.run(function(){
      view.append();
    });


    gestures = get(get(view, 'eventManager'), 'gestures');
    equal(gestures.length,1,"there should be only tap gesture");


    touchEvent = new jQuery.Event('touchstart');
    touchEvent['originalEvent'] = {
      targetTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };
    view.$().trigger(touchEvent);
    equal(gestures[0].touches.get('length') , 0,"the touch was not included on the tap gesture ");

    Em.AppGestureManager.set('isAllBlocked', false);


    touchEvent = new jQuery.Event('touchstart');
    touchEvent['originalEvent'] = {
      targetTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };
    view.$().trigger(touchEvent);
    equal(gestures[0].touches.get('length') , 1,"the touch was included on the tap gesture ");




});

test("manager avoid delivering events when gesture.isEnabled is false", function() {

    var endCalled;
    var view = Em.View.create({
      
      tapOptions: {
        numberOfRequiredTouches: 1,
        isEnabled: false
      },

      tapEnd: function(recognizer) {
        endCalled = true;
      }

    });


    endCalled = false;

    Em.run(function(){
      view.append();
    });


    gestures = get(get(view, 'eventManager'), 'gestures');
    equal(gestures.length,1,"there should be only tap gesture");


    touchEvent = new jQuery.Event('touchstart');
    touchEvent['originalEvent'] = {
      targetTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };
    view.$().trigger(touchEvent);
    equal(gestures[0].touches.get('length') , 0,"the touch was not included on the tap gesture ");


    gestures[0].set('isEnabled', true);


    touchEvent = new jQuery.Event('touchstart');
    touchEvent['originalEvent'] = {
      targetTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };
    view.$().trigger(touchEvent);
    equal(gestures[0].touches.get('length') , 1,"the touch was included on the tap gesture ");




});


test("manager avoid delivering events when gesture.isEnabled is setup via binding", function() {

    var endCalled;
    var view = Em.View.create({

      isTapEnabled: false,

      tapOptions: {
        numberOfRequiredTouches: 1,
        isEnabledBinding: 'isTapEnabled'
      },

      tapEnd: function(recognizer) {
        endCalled = true;
      }

    });


    endCalled = false;

    Em.run(function(){
      view.append();
    });


    gestures = get(get(view, 'eventManager'), 'gestures');
    equal(gestures.length,1,"there should be only tap gesture");


    touchEvent = new jQuery.Event('touchstart');
    touchEvent['originalEvent'] = {
      targetTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };
    view.$().trigger(touchEvent);
    equal(gestures[0].touches.get('length') , 0,"the touch was included on the tap gesture ");

    Em.run(function(){
      view.set('isTapEnabled', true);
    });

    touchEvent = new jQuery.Event('touchstart');
    touchEvent['originalEvent'] = {
      targetTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };
    view.$().trigger(touchEvent);
    equal(gestures[0].touches.get('length') , 1,"the touch was included on the tap gesture ");

});


test("manager avoid delivering events when a delegate rule return false", function() {

    var endCalled;
    var ruleResult;
    var delegateResult;


    var myDelegateRule = Em.DelegateRule.create({

      shouldReceiveTouch: function(gesture, view, event) {
        return ruleResult;
      }

    });

    var delegate = Em.GestureDelegate.create({
        name: 'application_delegate',
        rules: [myDelegateRule],


        shouldReceiveTouch: function(gesture, view, event) {
          return delegateResult;
        }
    });

    var view = Em.View.create({
      
      tapOptions: {
        numberOfRequiredTouches: 1,
        delegate: delegate
      },

      tapEnd: function(recognizer) {
        endCalled = true;
      }

    });


    endCalled = false;
    ruleResult = undefined;
    delegateResult = true;




    Em.run(function(){
      view.append();
    });


    gestures = get(get(view, 'eventManager'), 'gestures');
    equal(gestures.length,1,"there should be only tap gesture");


    touchEvent = new jQuery.Event('touchstart');
    touchEvent['originalEvent'] = {
      targetTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };
    view.$().trigger(touchEvent);

    equal(gestures[0].touches.get('length') , 1,"the touch was included on the tap gesture ");

    touchEvent = new jQuery.Event('touchend');
    touchEvent['originalEvent'] = {
      changedTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };


    view.$().trigger(touchEvent);
    ok(endCalled, 'event was recognized');



    endCalled = false;
    ruleResult = false;
    delegateResult = true;


    touchEvent = new jQuery.Event('touchstart');
    touchEvent['originalEvent'] = {
      targetTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };
    view.$().trigger(touchEvent);


    equal(gestures[0].touches.get('length') , 0,"the touch was not included on the tap gesture ");


    touchEvent = new jQuery.Event('touchend');
    touchEvent['originalEvent'] = {
      changedTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };

    view.$().trigger(touchEvent);
    ok(!endCalled, 'event was not recognized, because it was blocked by a delegate rule');

});


test("manager avoid delivering events when delegate ReceiveTouch is false", function() {

    var blocked = false;
    var endCalled = false;

    var delegate = Em.GestureDelegate.create({
        name: 'delegate',

        shouldReceiveTouch: function(gesture, view, event) {
          return !blocked; 
        }

    });

    var view = Em.View.create({
      
      tapOptions: {
        numberOfRequiredTouches: 1,
        delegate: delegate
      },

      tapEnd: function(recognizer) {
        endCalled = true;
      }


    });

    Em.run(function(){
      view.append();
    });


    touchEvent = new jQuery.Event('touchstart');
    touchEvent['originalEvent'] = {
      targetTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };
    view.$().trigger(touchEvent);


    gestures = get(get(view, 'eventManager'), 'gestures');
    equal(gestures.length,1,"there should be only tap gesture");
    equal(gestures[0].touches.get('length') , 1,"the touch was included on the tap gesture ");


    touchEvent = new jQuery.Event('touchend');
    touchEvent['originalEvent'] = {
      changedTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };


    view.$().trigger(touchEvent);
    ok(endCalled, 'event was recognized');



    endCalled = false;
    blocked = true;


    touchEvent = new jQuery.Event('touchstart');
    touchEvent['originalEvent'] = {
      targetTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };
    view.$().trigger(touchEvent);


    gestures = get(get(view, 'eventManager'), 'gestures');
    equal(gestures.length,1,"there should be only tap gesture");
    equal(gestures[0].touches.get('length') , 0,"the touch was not included on the tap gesture ");


    touchEvent = new jQuery.Event('touchend');
    touchEvent['originalEvent'] = {
      changedTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };

    view.$().trigger(touchEvent);
    ok(!endCalled, 'event was not recognized, because it was blocked by the rule');

});



test("manager avoid delivering events based on appGestureManager blocking logic", function() {

    var endCalled = false;

    var blocked = false;
    var blockedFn = function(view ) {
      return blocked;
    };


    var view = Em.View.create({
      
      tapOptions: {
        numberOfRequiredTouches: 1
      },
      tapEnd: function(recognizer) {
        endCalled = true;
      }

    });

    Em.run(function(){
      view.append();
    });


    Em.AppGestureManager.block(view, blockedFn);

    touchEvent = new jQuery.Event('touchstart');
    touchEvent['originalEvent'] = {
      targetTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };

    view.$().trigger(touchEvent);

    touchEvent = new jQuery.Event('touchend');
    touchEvent['originalEvent'] = {
      changedTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };

    view.$().trigger(touchEvent);


    equal(gestures[0].touches.get('length') , 0,"no touch was included on the tap gesture ");
    ok(!endCalled, 'event was not recognized because AppGestureManager was blocking it');


    Em.AppGestureManager.unblock(view);


    touchEvent = new jQuery.Event('touchstart');
    touchEvent['originalEvent'] = {
      targetTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };

    view.$().trigger(touchEvent);

    touchEvent = new jQuery.Event('touchend');
    touchEvent['originalEvent'] = {
      changedTouches: [{
        pageX: 0,
        pageY: 10
      }]
    };

    view.$().trigger(touchEvent);


    ok(endCalled, 'event was recognized after unblocking AppGestureManager');


});
