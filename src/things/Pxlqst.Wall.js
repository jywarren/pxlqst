Pxlqst.Wall = Pxlqst.Thing.extend({

  cssClass: 'wall',

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    // walls don't do anything. 

    return this;

  }

});
