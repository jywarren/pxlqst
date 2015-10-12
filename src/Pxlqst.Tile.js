Pxlqst.Tile = Class.extend({

  init: function(x, y, room) {

    var tile = this;

    tile.index = (y * room.tilesWide + x);
    tile.things = [];
    tile.x = x;
    tile.y = y;
    tile.room = room;
    tile.row = $('.row-' + y);
    tile.row.append("<div class='tile floor column-" + x + " tile-" + (y * room.tilesWide + x) + "'></div>");
    tile.el = $('.tile-' + tile.index);


    // does the tile contain anything of given class?
    // (could use .is for materials?)
    tile.has = function(classname) {

      var hasThing = false;

      tile.things.forEach(function(thing) {

        if (thing instanceof classname) hasThing = thing;

      });

      return hasThing;

    }


    // return northward tile
    tile.north = function() {

      return room.tile(tile.x, tile.y - 1);

    }


    // return southward tile
    tile.south = function() {

      return room.tile(tile.x, tile.y + 1);

    }


    // return westward tile
    tile.west = function() {

      return room.tile(tile.x - 1, tile.y);

    }


    // return eastward tile
    tile.east = function() {

      return room.tile(tile.x + 1, tile.y);

    }


    // does a neighboring tile contain anything of given class?
    tile.nextTo = function(classname) {

      var isNextTo = false;

      if (tile.north() && tile.north().has(classname)) isNextTo = true;
      if (tile.south() && tile.south().has(classname)) isNextTo = true;
      if (tile.east()  && tile.east().has(classname)) isNextTo = true;
      if (tile.west()  && tile.west().has(classname)) isNextTo = true;

      return isNextTo;

    }


    // create a new thing and add it to this tile's things
    tile.create = function(thing) {

      thing = new thing(tile.x, tile.y, tile.room);

      tile.add(thing);

      return thing;

    }


    // add thing to this tile's things
    tile.add = function(thing) {

      tile.things.push(thing);

      // set appearance
      tile.el.addClass(thing.cssClass);

      return thing;

    }


    // remove thing from this tile's things
    tile.remove = function(thing) {

      tile.things.splice(tile.things.indexOf(thing), 1);

      // unset appearance
      tile.el.removeClass(thing.cssClass);

      // have to remove all manually applied colors etc;
      // 

      return thing;

    }


    // remove all classes, start over
    tile.reset = function() {

      if (Math.random() > 0.5) tile.el.addClass('dark-floor');

    }


    tile.reset();

    return tile;

  }

});
