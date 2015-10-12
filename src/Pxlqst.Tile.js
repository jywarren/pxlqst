Pxlqst.Tile = Class.extend({

  init: function(x, y, room) {

    var tile = this;

    tile.index = (y * room.tilesWide + x);
    tile.objects = [];
    tile.x = x;
    tile.y = y;
    tile.room = room;
    tile.row = $('.row-' + y);
    tile.row.append("<div class='tile floor column-" + x + " tile-" + (y * room.tilesWide + x) + "'></div>");
    tile.el = $('.tile-' + tile.index);


    // create a new object and add it to this tile's objects
    tile.create = function(object) {

      object = new object(tile.x, tile.y, tile.room);

      tile.add(object);

      return object;

    }


    // add object to this tile's objects
    tile.add = function(object) {

      tile.objects.push(object);

      // set appearance
      tile.el.addClass(object.cssClass);

      return object;

    }


    // remove object from this tile's objects
    tile.remove = function(object) {

      tile.objects.splice(tile.objects.indexOf(object), 1);

      // unset appearance
      tile.el.removeClass(object.cssClass);

      // have to remove all manually applied colors etc;
      // 

      return object;

    }


    // remove all classes, start over
    tile.reset = function() {

      if (Math.random() > 0.5) tile.el.addClass('dark-floor');

    }


    tile.reset();

    return tile;

  }

});
