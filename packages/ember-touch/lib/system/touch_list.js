// ==========================================================================
// Project:  Ember Touch
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Em.get;
var set = Em.set;

/**
  @class
  @private

  Used to manage and maintain a list of active touches related to a gesture 
  recognizer.
*/
Em.TouchList = Em.Object.extend({
  touches: null,

  timestamp: null,

  init: function() {
    this._super();

    set(this, 'touches', []);
  },

  addTouch: function(touch) {
    var touches = get(this, 'touches');
    touches.push(touch);
    this.notifyPropertyChange('touches');
  },

  updateTouch: function(touch) {
    var touches = get(this, 'touches');

    for (var i=0, l=touches.length; i<l; i++) {
      var _t = touches[i];

      if (_t.identifier === touch.identifier) {
        touches[i] = touch;
        this.notifyPropertyChange('touches');
        break;
      }
    }
  },

  removeTouch: function(touch) {
    var touches = get(this, 'touches');

    for (var i=0, l=touches.length; i<l; i++) {
      var _t = touches[i];

      if (_t.identifier === touch.identifier) {
        touches.splice(i,1);
        this.notifyPropertyChange('touches');
        break;
      }
    }
  },

  removeAllTouches: function() {
    set(this, 'touches', []);
  },

  touchWithId: function(id) {
    var ret = null,
        touches = get(this, 'touches');

    for (var i=0, l=touches.length; i<l; i++) {
      var _t = touches[i];

      if (_t.identifier === id) {
        ret = _t;
        break;
      }
    }

    return ret;
  },

  length: Ember.computed(function() {
    var touches = get(this, 'touches');
    return touches.length;
  }).property('touches').cacheable()

});
