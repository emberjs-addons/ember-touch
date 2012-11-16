
/**
@module ember
@submodule ember-touch
*/

/**
  Registry of delegates in the system. A instance of this class is injected in the Application namespace.
  
  @class GestureDelegates
  @namespace Ember
  @extends Em.Object
  @private
  @static
*/

Em.GestureDelegates = Em.Object.extend({

  _delegates: {},

  add: function(delegate) {
    this._delegates[ delegate.get('name') ] = delegate;
  },

  find: function( name ) {
    return this._delegates[name];
  },

  clear: function() {
    this._delegates = {};
  }


});
