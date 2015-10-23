Pxlqst.World = Class.extend({

  currentRoom: 0,
  rooms: [],
  tilesWide: 16,

  init: function() {

    var world = this;


    world.resize = function() {

      if ($(window).width() < $(window).height()) var smallestDimension = $(window).width();
      else                                        var smallestDimension = $(window).height() - 100;

      world.roomWidth = Math.ceil(smallestDimension * 0.85);

      $('.viewport').width( world.roomWidth)
                    .height(world.roomWidth);

      $('.health').width(world.roomWidth);

      world.tileWidth = world.roomWidth / world.tilesWide - 5; // account for border-width

      $('.tile').width(  world.tileWidth)
                .height( world.tileWidth);

      $('.health').css('margin-top', world.tileWidth);
      $('.credits').css('margin-right', ($(window).width() - world.roomWidth) / 2);

    }


    world.addRoom = function(oldRoom, direction) {

      var room = new Pxlqst.Room(world, world.tilesWide);
      world.rooms.push(room);

      // only if provided:
      if (oldRoom && direction) oldRoom.attach(room, direction);

      return room;

    }


    world.goTo = function(room) {

      world.currentRoom = room;
      room.draw();

      return room;

    }


    world.goTo(world.addRoom());

    // add a "choose a profession" intro
    world.you = world.currentRoom.tile(8, 8).add(new Pxlqst.You(8, 8, 'thief', world.currentRoom));


    world.resize();

    $(window).on('resize', world.resize);

    return world;

  }

});
