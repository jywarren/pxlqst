Pxlqst.Sword = Pxlqst.Tool.extend({

  cssClass: 'sword',

  // Can we do a sword shimmering in the light?
  //shimmers: ['yellow', 'orange', '#f84', '#fa2', 'red'],

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var sword = this;


    sword.use = function(tile) {

      if (tile.has(Pxlqst.Actor)) {

        tile.has(Pxlqst.Actor).hit();

        return true;

      } else return false;

    }

    return sword;

  }

});
