// ==========================================================================
// Project:  Ember Touch 
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


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


