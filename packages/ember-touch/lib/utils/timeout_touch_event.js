Em.TimeoutTouchEventType = {
  Cancel: 'cancel',
  End: 'end'
};

/**
Based on custom  gestures implementation. A `TimeoutTouchEvent` event is
normally created to fire automatically after a given period of time.
A view [gesture]Event which must be executed without being generated
by an user touch event.

@class TimeoutTouchEvent
@namespace Ember
*/
Em.TimeoutTouchEvent = function(options){
  this.type = options.type;
};
