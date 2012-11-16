/*globals MyApp:true */

var set = Em.set;
var get = Em.get;
var application;
var touchEvent;
var gestures;
var endCalled;

module("Gesture Delegate", {

  setup: function() {
    application = Em.Application.create({
      ready: function() {
        start();
      }
    });
    stop();
    MyApp = {};
  },

  teardown: function() {
    application.destroy();
    MyApp = null;
  }

});





test("can be assigned with delegateName property ", function() {


    var delegate = Em.GestureDelegate.create({
        name: 'application_delegate',

        shouldReceiveTouch: function(gesture, view, event) {
          return true; 
        }

    });

    var gestureDelegates = application.get('gestureManager').get('delegates');

    gestureDelegates.add(delegate);

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



    gestureDelegates.clear();

});

test("can create delegate rules and assign the gestureDelegate property on the property", function() {

    MyApp.MyDelegateRule1 = Em.DelegateRule.extend({});

    var delegate1 = Em.GestureDelegate.create({
      name: 'application_delegate',
      rules: ['MyApp.MyDelegateRule1']
    });

    equal(delegate1.rules.length,1,"there should be only a rule");
    ok( delegate1.rules[0].gestureDelegate === delegate1 ,"the gestureDelegate rule property has been assigned on delegate creation");


    var delegate2 = Em.GestureDelegate.create({
      name: 'application_delegate',
      rules: [MyApp.MyDelegateRule1]
    });

    equal(delegate2.rules.length,1,"there should be only a rule");
    ok( delegate2.rules[0].gestureDelegate === delegate2 ,"the gestureDelegate rule property has been assigned on delegate creation");

});


test("can assign the gestureDelegate property on rule instances", function() {

    MyApp.myDelegateRule1 = Em.DelegateRule.create({});


    MyApp.myDelegateRule2 = Em.DelegateRule.create({});

    var delegate1 = Em.GestureDelegate.create({
      name: 'application_delegate',
      rules: [MyApp.myDelegateRule1, MyApp.myDelegateRule2]
    });

    equal(delegate1.rules.length,2,"there should be 2 rules");

    ok( delegate1.rules[0].gestureDelegate === delegate1 ,"the gestureDelegate rule property has been assigned on delegate creation");
    ok( delegate1.rules[1].gestureDelegate === delegate1 ,"the gestureDelegate rule property has been assigned on delegate creation");

    ok( MyApp.myDelegateRule1.gestureDelegate === delegate1 ,"the gestureDelegate rule property has been assigned on delegate creation ");
    ok( MyApp.myDelegateRule2.gestureDelegate === delegate1 ,"the gestureDelegate filter property has been assigned on delegate creation ");

});
