Pxlqst.Room = Class.extend({

  tiles: [],
  tilesWide: 16,

  neighbors: {

    n: undefined,
    e: undefined,
    s: undefined,
    w: undefined

  },

  init: function(world) {

    var room = this;

    room.world = world; 

    $('.viewport').append('<div class="room"></div>');
    room.el = $('.viewport .room:last')

    // will need refreshing on screen/window resize:
    room.el.width( world.roomWidth)
           .height(world.roomWidth);


    room.width = function() {

      return world.roomWidth;

    }


    room.tile = function(x, y) {

      return room.tiles[y * room.tilesWide + x];

    }


    room.attach = function(newRoom, direction) {

      room.neighbors[direction] = newRoom;

      return newRoom;

    }


    room.hasNeighbor = function(direction) {

      return room.neighbors[direction] != undefined;

    }


    room.draw = function() {


      for (var y = 0; y < room.tilesWide; y++) {
  
        room.el.append("<div class='tileRow row-" + y + "'></div>");
  
        for (var x = 0; x < room.tilesWide; x++) {
  
          var tile = new Pxlqst.Tile(x, y, room);
 
          room.tiles.push(tile);
 
          if (x == 0 || x == 15 || y == 0 || y == 15) tile.create(Pxlqst.Wall);
  
        }
  
      }

    }


    return room;

  }

});
