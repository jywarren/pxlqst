Pxlqst.World = Class.extend({

  currentRoom: 0,
  rooms: [],

  init: function() {

    var world = this;

    world.resize = function() {

      $('.viewport').width( $(document).width() * 0.75)
                    .height($(document).width() * 0.75);

      world.roomWidth = $('.viewport').width();

      $('.tile').width(  world.roomWidth / 16 - 8) // account for border-width
                .height( world.roomWidth / 16 - 8);

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


    world.resize();

    return world;

  }

});
