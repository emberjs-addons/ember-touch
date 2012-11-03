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


