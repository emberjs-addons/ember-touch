Em.TimeoutTouchEventType = {
  Cancel: 'cancel',
  End: 'end'
};

/**
Based on your gesture implementation, a TimeoutTouchEvent event is 
normally created to fire automatically after a period of time a 
view [gesture]Event which must be executed without being generated 
by a user touch event.

@class TimeoutTouchEvent
@namespace Ember
*/
Em.TimeoutTouchEvent = function(options){
	this.type = options.type;
};
