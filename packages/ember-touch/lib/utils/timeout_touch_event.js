Em.TimeoutTouchEventType = {
  Cancel: 'cancel',
  End: 'end'
};

Em.TimeoutTouchEvent = function(options){
	this.type = options.type;
};
