var set = Em.set;
var get = Em.get;

var gesture = Em.Gesture.create();

module("Em.Gesture");

test("distance", function() {
  var distance;

  distance = gesture.distance([{pageX:0,pageY:0},{pageX:10,pageY:0}]);
  equal(distance,10,'x distance');

  distance = gesture.distance([{pageX:0,pageY:0},{pageX:0,pageY:10}]);
  equal(distance,10,'y distance');

  distance = gesture.distance([{pageX:0,pageY:0},{pageX:0,pageY:0}]);
  equal(distance,0,'0 distance');
});

test("centerPoint", function() {
  var point;

  point = gesture.centerPointForTouches([{pageX:0,pageY:0},{pageX:10,pageY:0}]);
  equal(point.x,5,'x distance');
  equal(point.y,0,'x distance');

  point = gesture.centerPointForTouches([{pageX:0,pageY:0},{pageX:0,pageY:10}]);
  equal(point.x,0,'y distance');
  equal(point.y,5,'y distance');

  point = gesture.centerPointForTouches([{pageX:0,pageY:0},{pageX:0,pageY:0}]);
  equal(point.x,0,'0 distance');
  equal(point.y,0,'0 distance');
});

test("attemptGestureEventDelivery", function() {
  var numCalled = 0, dataCalled, gestureCalled, viewEvent;
  var view = Em.Object.create({
    myGestureStart: function(recognizer, evt) {
      viewEvent = evt;
      gestureCalled = recognizer;
      numCalled++;
    }
  });

  set(gesture, 'view', view);

  var touchEvent = new jQuery.Event();
  touchEvent.type='touchstart';

  gesture.attemptGestureEventDelivery('myGestureStart', touchEvent );
  equal(numCalled,1,'called once');
  equal(gestureCalled,gesture,'gesture passed through');
  equal(touchEvent, viewEvent,'touchEvent are passed to view gestureEvents');

});
