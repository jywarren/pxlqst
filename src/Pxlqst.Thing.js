Pxlqst.Thing = Class.extend({

  init: function(x, y, room) {

    var thing = this;

    thing.x = x;
    thing.y = y;
    thing.room = room;


    thing.tile = function() {

      return room.tile(thing.x, thing.y);

    }


    // move to any tile, removing self from old tile
    thing.move = function(_x, _y) {
      
          thing.tile().remove(thing);
       
          room.tile(_x, _y).add(thing);

    }


    return thing;

  }

});
