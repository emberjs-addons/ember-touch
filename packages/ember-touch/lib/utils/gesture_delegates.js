
/**
@module ember
@submodule ember-touch
*/

/**

  This is a singleton class to registry of delegates in the system.   
  
  @class GestureDelegates
  @namespace Ember
  @extends Em.Object
  @private
  @static
*/

Em.GestureDelegates = Em.Object.create({

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


