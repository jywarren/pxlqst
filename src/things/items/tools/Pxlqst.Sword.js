Pxlqst.Sword = Pxlqst.Tool.extend({

  cssClass: 'sword',

  // Can we do a sword shimmering in the light?
  //shimmers: ['yellow', 'orange', '#f84', '#fa2', 'red'],

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var sword = this;

    // also, don't enter the tile if it's occupied.
    // move should return true or false!
    //sword.use = function(tile) {
    //sword.superMove = sword.move;
    sword.use = function(x, y) {

      if (sword.room.tile(x, y).has(Pxlqst.Actor)) {

        sword.room.tile(x, y).has(Pxlqst.Actor).hit();

        sword.superUse(x, y);

        return true; // when switching to use(), return if it was used

      } else return false;

    }


    return sword;

  }

});
