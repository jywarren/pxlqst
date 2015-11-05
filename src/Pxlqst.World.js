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

      $('.viewport, .room').width( world.roomWidth)
                           .height(world.roomWidth);

      $('.health').width(world.roomWidth);

      world.tileWidth = world.roomWidth / world.tilesWide; // account for border-width of 2px on each side; moz likes 5, other 4
      // the above is usually a decimal; firefox may not like that?
      // we could round the tileWidth, then recalc room width?
      //world.tileWidth = Math.round(world.roomWidth / world.tilesWide - 4); // account for border-width of 2px on each side; moz likes 5, other 4

      $('.tile').outerWidth(  world.tileWidth)
                .outerHeight( world.tileWidth);

      $('.health').css('margin-top', world.tileWidth);
      $('.credits').css('margin-right', ($(window).width() - world.roomWidth) / 2);

    }


    world.addRoom = function(oldRoom, direction) {

      var room = new Pxlqst.Room(world, world.tilesWide, 0, 0);
      room.create();
      world.rooms.push(room);

      // only if provided:
      if (oldRoom && direction) oldRoom.attach(room, direction);

      return room;

    }


    // eventually this should not just create a new room, 
    // but should look it up from some room index
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

      return world.room;

    }

    world.room = world.addRoom();

    // add next room to north
// figure out how to store rooms:
    world.northRoom = world.addRoom(world.room, 'n');
    world.northRoom.hide();

    // add a "choose a profession" intro here
    world.you = world.room.tile(8, 8).add(new Pxlqst.You(8, 8, 'thief', world.room));


    world.resize();

    $(window).on('resize', world.resize);

    return world;

  }

});
