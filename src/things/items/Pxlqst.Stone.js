Pxlqst.Stone = Pxlqst.Item.extend({

  cssClass: 'stone',

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var stone = this;

    stone.pushable = true;

    return stone;

  }

});
