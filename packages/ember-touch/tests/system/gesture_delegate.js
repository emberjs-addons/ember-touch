/*globals MyApp:true */

var set = Em.set;
var get = Em.get;
var application;
var touchEvent;
var gestures;
var endCalled;

module("Gesture Delegate", {

  setup: function() {
    application = Em.Application.create();
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

test("can create delegate filters and assign the gestureDelegate property on the property", function() {

    MyApp.MyDelegateFilter1 = Em.DelegateFilter.extend({
    });

    var delegate1 = Em.GestureDelegate.create({
        name: 'application_delegate',
        filters: ['MyApp.MyDelegateFilter1']
    });

    equal(delegate1.filters.length,1,"there should be only a filter");
    ok( delegate1.filters[0].gestureDelegate === delegate1 ,"the gestureDelegate filter property has been assigned on delegate creation");


    var delegate2 = Em.GestureDelegate.create({
        name: 'application_delegate',
        filters: [MyApp.MyDelegateFilter1]
    });

    equal(delegate2.filters.length,1,"there should be only a filter");
    ok( delegate2.filters[0].gestureDelegate === delegate2 ,"the gestureDelegate filter property has been assigned on delegate creation");

});


test("can assign the gestureDelegate property on filter instances", function() {

    MyApp.myDelegateFilter1 = Em.DelegateFilter.create({
    });


    MyApp.myDelegateFilter2 = Em.DelegateFilter.create({
    });

    var delegate1 = Em.GestureDelegate.create({
        name: 'application_delegate',
        filters: [MyApp.myDelegateFilter1, MyApp.myDelegateFilter2]
    });

    equal(delegate1.filters.length,2,"there should be 2 filters");

    ok( delegate1.filters[0].gestureDelegate === delegate1 ,"the gestureDelegate filter property has been assigned on delegate creation");
    ok( delegate1.filters[1].gestureDelegate === delegate1 ,"the gestureDelegate filter property has been assigned on delegate creation");

    ok( MyApp.myDelegateFilter1.gestureDelegate === delegate1 ,"the gestureDelegate filter property has been assigned on delegate creation ");
    ok( MyApp.myDelegateFilter2.gestureDelegate === delegate1 ,"the gestureDelegate filter property has been assigned on delegate creation ");

});
