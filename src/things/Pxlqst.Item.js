Pxlqst.Item = Pxlqst.Thing.extend({

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var item = this;


    // keeps x, y in bounds
    item.take = function(_x, _y) {

      // user.inventory.add(item);

    }


    return item;

  }

});
