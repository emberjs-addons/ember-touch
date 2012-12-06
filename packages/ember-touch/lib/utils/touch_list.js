var get = Em.get; var set = Em.set;

/**
@module ember
@submodule ember-touch
*/
/**
  This component manages and maintains a list of active touches related
  to a gesture recognizer.

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
    Add a touch event to the list.
    This method is called only in the initialization of
    the touch session adding touchstart events.

    @method addTouch
  */
  addTouch: function(touch) {
    var touches = get(this, 'touches');
    touches.push(touch);
    this.notifyPropertyChange('touches');
  },

  /**
    Update a touch event from the list.
    Given a touch event, it will iterate the current
    list to replace with the event the item whose
    identifier is equal to the event identifier.
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
    Reset the touch list.
    @method removeAllTouches
  */
  removeAllTouches: function() {
    set(this, 'touches', []);
  },

  /**
    Given a touch identifier, it returns the touch event
    with the same identifier in the list.

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


  /**
    Length of the touch list.
    @property length
  */
  length: Ember.computed(function() {
    var touches = get(this, 'touches');
    return touches.length;
  }).property('touches').cacheable()

});
