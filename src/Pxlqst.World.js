Pxlqst.World = Class.extend({

  room: 0,
  rooms: [],
  tilesWide: 16,

  init: function() {

    var world = this;
    console.log('world created');


    world.resize = function() {

      if ($(window).width() < $(window).height()) var smallestDimension = $(window).width();
      else                                        var smallestDimension = $(window).height() - 100;

      world.roomWidth = Math.ceil(smallestDimension * 0.85);

      $('.viewport, .room').width( world.roomWidth + 3) // extra pixels for Firefox display fix
                           .height(world.roomWidth);

      $('.health').width(world.roomWidth);

      world.tileWidth = world.roomWidth / world.tilesWide;

      $('.tile').outerWidth(  world.tileWidth)
                .outerHeight( world.tileWidth);

      $('.health').css('margin-top', world.tileWidth);
      $('.credits').css('margin-right', ($(window).width() - world.roomWidth) / 2);

    }


    world.addRoom = function(oldRoom, direction) {

      var newRoom = new Pxlqst.Room(world, world.tilesWide, 0, 0);
      newRoom.create();
      world.rooms.push(newRoom);

      // only if provided:
      if (oldRoom && direction) oldRoom.attach(newRoom, direction);

      world.resize(); // refresh

      return newRoom;

    }


    // Accepts 'n' 'e' 's' or 'w' as a <direction>
    // Eventually this should not just create a new room, 
    // but should look it up from some room index.
    world.move = function(direction) {

      var x = 0,
          y = 0;

      if (direction == 'n') y += world.tilesWide;
      if (direction == 's') y -= world.tilesWide;
      if (direction == 'e') x += world.tilesWide;
      if (direction == 'w') x -= world.tilesWide;

      var oldRoom = world.room;

      oldRoom.move(x, y, function() {
        oldRoom.hide();
      });

      world.room = world.room.neighbors[direction];

      world.room.x = -x;
      world.room.y = -y;
      world.room.show();

      world.room.move(0, 0, function() {
        oldRoom.hide();
      });

      // record old position:
      var you_x = world.you.x,
          you_y = world.you.y;

      // adjust position:
      if (direction == 'n') you_y += world.tilesWide - 1;
      if (direction == 's') you_y -= world.tilesWide - 1;
      if (direction == 'e') you_x -= world.tilesWide - 1;
      if (direction == 'w') you_x += world.tilesWide - 1;

      // remove You from old room:
      world.you.tile().remove(world.you);

      // add to new room, in new location:
console.log(world.room.tile(you_x, you_y), you_x, you_y);
      world.room.tile(you_x, you_y).add(world.you);

// sleep everything from old room!



      return world.room;

    }

    world.room = world.addRoom();

    // add a "choose a profession" intro here
    world.you = world.room.tile(8, 8).add(new Pxlqst.You(8, 8, 'thief', world.room));

    world.resize();

    $(window).on('resize', world.resize);

    return world;

  }

});
