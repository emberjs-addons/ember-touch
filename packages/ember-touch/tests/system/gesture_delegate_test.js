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

test("can create delegate rules", function() {

    MyApp.MyDelegateRule1 = Em.GestureDelegateRule.extend({});

    var delegate1 = Em.GestureDelegate.create({
      name: 'application_delegate',
      rules: ['MyApp.MyDelegateRule1']
    });

    equal(delegate1.rules.length,1,"there should be only a rule");


    var delegate2 = Em.GestureDelegate.create({
      name: 'application_delegate',
      rules: [MyApp.MyDelegateRule1]
    });

    equal(delegate2.rules.length,1,"there should be only a rule");

}); 
