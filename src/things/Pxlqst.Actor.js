Pxlqst.Actor = Pxlqst.Thing.extend({

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var actor = this;


    // keeps x, y in bounds
    actor.confineToRoom = function(_x, _y) {

      if (_x < 0) _x = 0;
      if (_y < 0) _y = 0;
      if (_x > room.tilesWide) _x = room.tilesWide;
      if (_y > room.tilesWide) _y = room.tilesWide;

    }


    actor.goTo = function(_x, _y) {
      
          actor.tile().remove(actor);
       
          room.tile(_x, _y).add(actor);

    }


    return actor;

  }

});
