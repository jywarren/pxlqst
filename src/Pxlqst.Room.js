Pxlqst.Room = Class.extend({


  // x, y is measured in Pxls
  init: function(world, tilesWide, x, y, id) {

    var room = this;

    room.world = world; 
    room.tiles = []; 
    room.tilesWide = tilesWide; 
    room.id = id || parseInt(Math.random() * 10000);

    room.x = x || 0;
    room.y = y || 0;

    $('.viewport').append('<div class="room room-' + room.id + '"></div>');
    room.el = $('.viewport .room-' + room.id)

    // default key:
    room.key = {
    
      ' ': false, // floor
      '0': Pxlqst.Wall,
      'X': Pxlqst.You,
      'Z': Pxlqst.Zombie,
      'r': Pxlqst.Rat,
      't': Pxlqst.Torch,
      'S': Pxlqst.Stone,
      's': Pxlqst.Sword,
      'c': Pxlqst.Cake
    
    };

    room.neighbors = {
 
      n: undefined,
      e: undefined,
      s: undefined,
      w: undefined
 
    }

    // will need refreshing on screen/window resize:
    room.el.width( world.roomWidth)
           .height(world.roomWidth);


    room.width = function() {

      return world.roomWidth;

    }


    room.tile = function(x, y) {

      return room.tiles[y * room.tilesWide + x];

    }


    room.things = function() {

      var things = [];

      room.tiles.forEach(function(tile) {

        things = things.concat(tile.things);

      });

      return things;

    }


    room.opposite = function(direction) {

      if (direction == 'n') return 's';
      if (direction == 's') return 'n';
      if (direction == 'e') return 'w';
      if (direction == 'w') return 'e';

    }


    room.attach = function(newRoom, direction) {

      room.neighbors[direction] = newRoom;

      newRoom.neighbors[room.opposite(direction)] = room;

      return newRoom;

    }


    room.hasNeighbor = function(direction) {

      return room.neighbors[direction] != undefined;

    }


    // Shift by one pixel width towards room.destination;
    // execute callback() if arrived.
    room.pan = function(callback) {

      if (Math.abs(room.destination.x - room.x) > Math.abs(room.destination.y - room.y)) {
        if (room.destination.x > room.x) room.x += 1;
        else                             room.x -= 1;
      } else {
        if (room.destination.y > room.y) room.y += 1;
        else                             room.y -= 1;
      }

      room.el.css('left', room.x * (room.world.roomWidth / world.tilesWide));
      room.el.css('top',  room.y * (room.world.roomWidth / world.tilesWide));

      if (room.interval && room.destination.x == room.x && room.destination.y == room.y) {

        clearInterval(room.interval);
        if (callback) callback();

      }

    }


    // unlike Pxlqst.Actor/Thing, moving sets a destination to pan() to
    room.move = function(x, y, callback) {

      room.destination = { x: x, y: y, callback: callback };

      // should stop old room.interval here if it exists
      if (room.interval) clearInterval(room.interval);

      room.interval = setInterval(function() {

        room.pan(callback);

      }, 100);

    }


    // Reads a <map> array of tile symbols using room.key lookup; 
    // see README for formatting.
    room.read = function(map) {

      map.forEach(function(row, y) {

        row.split('').forEach(function(letter, x) {

          if (room.key[letter] && room.key[letter] != ' ') {

            room.tile(x, y).create(room.key[letter]);

          }

        });

      });

    }


    // constructs room  out of Tiles, with outer wall
    room.create = function() {

      for (var y = 0; y < room.tilesWide; y++) {

        room.el.append("<div class='tileRow row-" + y + "'></div>");
  
        for (var x = 0; x < room.tilesWide; x++) {
  
          var tile = new Pxlqst.Tile(x, y, room);
 
          room.tiles.push(tile);
  
        }
  
      }

    }


    room.remove = function() {

      if (room.interval) clearInterval(room.interval);

      return room.el.remove();

    }


    room.show = function() {

      room.el.show();

    }


    room.hide = function() {

      room.el.hide();

    }


    // activate all things
    room.wake = function() {

      room.things().forEach(function(thing) {

        if (thing.wake) thing.wake();

      });

    }


    // deactivate all things
    room.sleep = function() {

      room.things().forEach(function(thing) {

        if (thing.sleep) thing.sleep();

      });

    }


    // create a door to the neighboring room, and a door leading back
    // Break out door into subclass
    room.addDoor = function(x, y) {

      var direction, counterpart, neighbor;

      if (y == 0) { 
        direction = 'n';
        counterpart = {x: x, y: room.tilesWide};
      } else if (y == room.tilesWide - 1) {
        direction = 's';
        counterpart = {x: x, y: 0};
      } else if (x == 0) {
        direction = 'e';
        counterpart = {x: 0, y: y};
      } else if (x == room.tilesWide - 1) {
        direction = 'w';
        counterpart = {x: room.tilesWide, y: y};
      }

      if (room.neighbors[direction]) {

        neighbor = room.neighbors[direction];
        counterpart = neighbor.tile(counterpart.x, counterpart.y);
        counterpart.remove(counterpart.things[0]);
        //counterpart.create(Pxlqst.Door);
 
        room.tile(x, y).remove(room.tile(x, y).things[0]);
        //room.tile(x, y).create(Pxlqst.Door);
 
        // For now, we'll just have Pxlqst.You trigger next room when you hit the edge of the room.

      } else {

        console.log("There's no room in that direction!");

      }

    }


    room.move(room.x, room.y);

    return room;

  }

});
