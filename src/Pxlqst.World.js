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

      $('.viewport').width( world.roomWidth)
                    .height(world.roomWidth);

      $('.health').width(world.roomWidth);

      world.tileWidth = world.roomWidth / world.tilesWide - 5; // account for border-width of 2px on each side; moz likes 5, other 4
      // the above is usually a decimal; firefox may not like that?
      // we could round the tileWidth, then recalc room width?
      //world.tileWidth = Math.round(world.roomWidth / world.tilesWide - 4); // account for border-width of 2px on each side; moz likes 5, other 4

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

      world.room = room;
      room.draw();

      return room;

    }


    world.goTo(world.addRoom());

    // add a "choose a profession" intro
    world.you = world.room.tile(8, 8).add(new Pxlqst.You(8, 8, 'thief', world.room));


    world.resize();

    $(window).on('resize', world.resize);

    return world;

  }

});
