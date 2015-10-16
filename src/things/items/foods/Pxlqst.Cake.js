Pxlqst.Cake = Pxlqst.Food.extend({

  cssClass: 'cake',

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var cake = this;

    cake.nutrition = 2;

    return cake;

  }

});
