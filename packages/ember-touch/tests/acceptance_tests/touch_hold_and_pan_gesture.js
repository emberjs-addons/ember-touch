var set = Em.set;
var get = Em.get;
var view;
var application;
var content = [];

var panStartWasCalled = false;
var panChangeWasCalled = false;
var panEndWasCalled = false;
var touchHoldEndWasCalled = false;

var touchHoldPeriod = 200;

module("Acceptance Touch Hold and Pan Gesture", {
  setup: function() {

    panStartWasCalled = false;
    panChangeWasCalled = false;
    panEndWasCalled = false;
    touchHoldEndWasCalled = false;

    application = Em.Application.create();

    application.View = Em.CollectionView.extend({
      
      content: Ember.A([0, 1, 2, 3, 4]),

      scale: 1,

      translate: {
        x: 0,
        y: 0
      },

      panOptions: {
        numberOfRequiredTouches: 1
      },

      panStart: function(recognizer) {
        panStartWasCalled = true;
        this.translate = recognizer.get('translation');
      },

      panChange: function(recognizer) {
        panChangeWasCalled = true;
        this.translate = recognizer.get('translation');
      },

      panEnd: function(recognizer) {
        panEndWasCalled = true;
        this.translate = recognizer.get('translation');
      },

      itemViewClass:  Em.View.extend({

        classNameBindings: ['selected'],

        touchHoldOptions: {
          holdPeriod: touchHoldPeriod,
          moveThreshold: 10
        },

        touchHoldEnd: function(recognizer) {
          touchHoldEndWasCalled = true;
        }

      })

    });


    Em.run(function() {
      view = application.View.create();
      view.append();
    });

  },

  teardown: function() {
    view.destroy();
    application.destroy();
  }

});

test("Performing the Pan gesture on the TapView, trigger the pan gesture on  PanView", function() {

  var touchEvent;


  var id =view.$().children()[0].id;
  var viewElement = view.$();
  var element = view.$('#'+id );

  touchEvent = new jQuery.Event();
  touchEvent.type='touchstart';
  touchEvent['originalEvent'] = {
    targetTouches: [ {
      identifier: 0,
      pageX: 0,
      pageY: 10
    }]
  };
  element.trigger( touchEvent );

  touchEvent = new jQuery.Event();
  touchEvent.type='touchmove';
  touchEvent['originalEvent'] = {
    changedTouches: [{
      identifier: 0,
      pageX: 5,
      pageY: 10
    }]
  };
  element.trigger( touchEvent );

  touchEvent = new jQuery.Event();
  touchEvent.type='touchmove';
  touchEvent['originalEvent'] = {
    changedTouches: [ {
      identifier: 0,
      pageX: 10,
      pageY: 10
    }]
  };
  element.trigger( touchEvent );

  touchEvent = new jQuery.Event();
  touchEvent.type='touchend';
  touchEvent['originalEvent'] = {
    targetTouches: [{
      identifier: 0,
      pageX: 10,
      pageY: 10
    }]
  };
  element.trigger( touchEvent );

  ok( panEndWasCalled, 'pan End Was called ');

});



test("When TouchHold is followed by Pan on the same element, both gestures are recognized", function() {

  var touchEvent;

  var id =view.$().children()[0].id;
  var viewElement = view.$();
  var element = view.$('#'+id );


  touchEvent = new jQuery.Event();
  touchEvent.type='touchstart';
  touchEvent['originalEvent'] = {
    targetTouches: [ {
      identifier: 0,
      pageX: 0,
      pageY: 10
    }]
  };
  element.trigger( touchEvent );

  stop();  
  
  setTimeout(function() {  

    ok( touchHoldEndWasCalled, 'touchEnd Was called ');

    touchEvent = new jQuery.Event();
    touchEvent.type='touchmove';
    touchEvent['originalEvent'] = {
      changedTouches: [{
        identifier: 0,
        pageX: 5,
        pageY: 10
      }]
    };
    element.trigger( touchEvent );

    touchEvent = new jQuery.Event();
    touchEvent.type='touchmove';
    touchEvent['originalEvent'] = {
      changedTouches: [ {
        identifier: 0,
        pageX: 10,
        pageY: 10
      }]
    };
    element.trigger( touchEvent );

    touchEvent = new jQuery.Event();
    touchEvent.type='touchend';
    touchEvent['originalEvent'] = {
      targetTouches: [{
        identifier: 0,
        pageX: 10,
        pageY: 10
      }]
    };
    element.trigger( touchEvent );

    ok( panEndWasCalled, 'pan End Was called ');

    start();

  }, touchHoldPeriod);

});

