Pxlqst.World = Class.extend({

  currentRoom: 0,
  rooms: [],

  init: function() {

    var world = this;


    world.resize = function() {

      if ($(window).width() < $(window).height()) var smallestDimension = $(window).width()
      else                                        var smallestDimension = $(window).height()

      $('.viewport').width( smallestDimension * 0.85)
                    .height(smallestDimension * 0.85);

      world.roomWidth = $('.viewport').width();

      $('.tile').width(  world.roomWidth / 16 - 4) // account for border-width
                .height( world.roomWidth / 16 - 4);

    }


    world.addRoom = function(oldRoom, direction) {

      var room = new Pxlqst.Room(world);
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
