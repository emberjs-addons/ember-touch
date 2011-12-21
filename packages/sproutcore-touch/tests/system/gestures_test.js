// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set = Em.set;
var get = Em.get;

module("Em.Gestures");

test("register new gestures", function() {
  var myGesture = Em.Gesture.create({
    isMyGesture: true
  });

  Em.Gestures.register('myGesture',myGesture);

  var newGestures = Em.Gestures.knownGestures();

  equals(newGestures['myGesture'],myGesture, "registered gesture is added");
});


test("register new gestures", function() {
  var myGesture = Em.Gesture.create({
    isMyGesture: true
  });

  Em.Gestures.register('myNewGesture',myGesture);

  var caught = false;

  try {
    Em.Gestures.register('myNewGesture',myGesture);
  } catch (e) {
    caught = true;
  }

  ok(caught);
});

test("unregister a gesture", function() {
  var myGesture = Em.Gesture.create({
    isMyGesture: true
  });

  Em.Gestures.register('myGesture2',myGesture);

  var newGestures = Em.Gestures.knownGestures();

  equals(newGestures['myGesture2'],myGesture, "registered gesture is added");

  Em.Gestures.unregister('myGesture2');

  newGestures = Em.Gestures.knownGestures();
  equals(newGestures['myGesture2'],undefined, "registered gesture is unregistered");
});

