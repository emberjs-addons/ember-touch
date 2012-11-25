var set = Em.set;
var get = Em.get;

module("Em.RegisteredGestures");

test("register new gestures", function() {
  var myGesture = Em.Gesture.create({
    isMyGesture: true
  });

  var registeredGestures = Em.RegisteredGestures.create();
  registeredGestures.register('myGesture',myGesture);

  var newGestures = registeredGestures.knownGestures();

  equal(newGestures['myGesture'],myGesture, "registered gesture is added");
});


test("register new gestures", function() {
  var myGesture = Em.Gesture.create({
    isMyGesture: true
  });

  var registeredGestures = Em.RegisteredGestures.create();
  registeredGestures.register('myNewGesture',myGesture);

  var caught = false;

  try {
    registeredGestures.register('myNewGesture',myGesture);
  } catch (e) {
    caught = true;
  }

  ok(caught);
});

test("unregister a gesture", function() {
  var myGesture = Em.Gesture.create({
    isMyGesture: true
  });

  var registeredGestures = Em.RegisteredGestures.create();
  registeredGestures.register('myGesture2',myGesture);

  var newGestures = registeredGestures.knownGestures();

  equal(newGestures['myGesture2'],myGesture, "registered gesture is added");

  registeredGestures.unregister('myGesture2');

  newGestures = registeredGestures.knownGestures();
  equal(newGestures['myGesture2'],undefined, "registered gesture is unregistered");
});

