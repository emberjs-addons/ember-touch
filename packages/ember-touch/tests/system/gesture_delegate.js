var set = Em.set;
var get = Em.get;
var application;
var touchEvent;
var gestures;


module("Gesture Delegate", {

  setup: function() {
    application = Em.Application.create();
  },

  teardown: function() {
    application.destroy();
  }

});


test("can block delivering touch events and prevent the gesture from being recognized", function() {

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
    ok(!endCalled, 'event was not recognized, because it was blocked by the delegate');

});


test("can be assigned with delegateName property ", function() {


    var delegate = Em.GestureDelegate.create({
        name: 'application_delegate',

        shouldReceiveTouch: function(gesture, view, event) {
          return true; 
        }

    });

    Em.GestureDelegates.add(delegate);

    var view = Em.View.create({
      
      tapOptions: {
        numberOfRequiredTouches: 1,
        delegateName: 'application_delegate'
      },

      tapEnd: function(recognizer) {
        endCalled = true;
      }


    });


    Em.run(function(){
      view.append();
    });


    gestures = get(get(view, 'eventManager'), 'gestures');
    equal(gestures.length,1,"there should be only tap gesture");
    ok( gestures[0].get('delegate') ,"the delegate must be assigned to the view based on delegateName property ");



    var view2 = Em.View.create({
      
      tapOptions: {
        numberOfRequiredTouches: 1
      },

      tapEnd: function(recognizer) {
        endCalled = true;
      }


    });


    Em.run(function(){
      view2.append();
    });


    gestures = get(get(view2, 'eventManager'), 'gestures');
    equal(gestures.length,1,"there should be only tap gesture");
    ok( !gestures[0].get('delegate') ,"the delegate is empty ");



    Em.GestureDelegates.clear();

});

