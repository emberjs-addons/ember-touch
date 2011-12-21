var set = Em.set;
var get = Em.get;

var application;
var view;

var touchEvent; 
var tapEndWasCalled = false;

module("Nested Gestures on childs are redispatched to parents", {

  setup: function() {
    application = Em.Application.create();


    tapEndWasCalled = false;

  },

  teardown: function() {
    if ( view ) view.destroy();
    application.destroy();
  }

});

test(" Gesture event on a childview should be attended by the parent when the child don't recognize the gesture.", function() {

  View = Em.ContainerView.extend({
    elementId: 'main',
    childViews: ['nestedChildView'],

    tapEnd: function(recognizer) {
      tapEndWasCalled = true;
    },

    nestedChildView: Em.ContainerView.extend({
      elementId: 'nestedchild'

    })

  });

  view = View.create();
  Em.run(function() {
    view.append();
  });

  touchEvent = jQuery.Event();
  touchEvent.type='touchstart';
  touchEvent['originalEvent'] = {
    targetTouches: [
      {
        identifier: 0,
        pageX: 0,
        pageY: 10
      }
    ]
  };

  $('#nestedchild').trigger(touchEvent);


  touchEvent = jQuery.Event();
  touchEvent.type='touchend';
  touchEvent['originalEvent'] = {
    changedTouches: [
      {
        identifier: 0,
        pageX: 0,
        pageY: 10
      }
    ]
  };

  $('#nestedchild').trigger(touchEvent);

  var manager = get(view, 'eventManager');
  var gestures = get(get(view, 'eventManager'), 'gestures');
  ok(tapEndWasCalled, 'tap end should have been called');


});


test(" Gesture event on a grandchildview should be attended by the parent when the childrens don't recognize the gesture.", function() {

  View = Em.ContainerView.extend({

    elementId: 'main',
    childViews: ['nestedChildView'],

    tapEnd: function(recognizer) {
      tapEndWasCalled = true;
    },

    nestedChildView: Em.ContainerView.extend({
      elementId: 'nestedchild',

      childViews: ['nestedGrandChildView'],

      nestedGrandChildView: Em.ContainerView.extend({
        elementId: 'nestedgrandchild'

      })

    })

  });

  view = View.create();
  Em.run(function() {
    view.append();
  });

  touchEvent = jQuery.Event();
  touchEvent.type='touchstart';
  touchEvent['originalEvent'] = {
    targetTouches: [
      {
        identifier: 0,
        pageX: 0,
        pageY: 10
      }
    ]
  };

  $('#nestedgrandchild').trigger(touchEvent);


  touchEvent = jQuery.Event();
  touchEvent.type='touchend';
  touchEvent['originalEvent'] = {
    changedTouches: [
      {
        identifier: 0,
        pageX: 0,
        pageY: 10
      }
    ]
  };

  $('#nestedgrandchild').trigger(touchEvent);

  var manager = get(view, 'eventManager');
  var gestures = get(get(view, 'eventManager'), 'gestures');
  ok(tapEndWasCalled, 'tap end should have been called');


});
