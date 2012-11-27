var get = Em.get; var set = Em.set;

/**
@module ember
@submodule ember-touch
*/
/**
  Used to manage and maintain a list of active touches related to a gesture recognizer.

  @class TouchList
  @namespace Ember
  @extends Ember.Object
  @private
*/
Em.TouchList = Em.Object.extend({

  /**
    @property touches
    @type Array
  */
  touches: null,

  /**
    @property timestamp
  */
  timestamp: null,

  init: function() {
    this._super();

    set(this, 'touches', []);
  },

  /**
    @method addTouch
  */
  addTouch: function(touch) {
    var touches = get(this, 'touches');
    touches.push(touch);
    this.notifyPropertyChange('touches');
  },

  /**
    @method updateTouch
  */
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

  /**
    @method removeTouch
  */
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

  /**
    @method removeAllTouches
  */
  removeAllTouches: function() {
    set(this, 'touches', []);
  },

  /**
    @method touchWithId
  */
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
