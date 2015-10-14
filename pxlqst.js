Pxlqst = {};

/* From http://ejohn.org/blog/simple-javascript-inheritance/ */

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();

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

Pxlqst.Thing = Class.extend({

  init: function(x, y, room) {

    var object = this;

    object.x = x;
    object.y = y;
    object.room = room;


    object.tile = function() {

      return room.tile(object.x, object.y);

    }


    return object;

  }

});

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


    tile.el.click(function(e) {
      room.world.you.walkToward(tile.x, tile.y);
    });


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

      thing.x = tile.x;
      thing.y = tile.y;

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

      tile.el.attr('style', '');
      if (Math.random() > 0.5) tile.el.addClass('dark-floor');

    }


    tile.reset();

    return tile;

  }

});

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

Pxlqst.Actor = Pxlqst.Thing.extend({

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var actor = this;


    // keeps x, y in bounds
    actor.confineToRoom = function(_x, _y) {

      if (_x < 0) _x = 0;
      if (_y < 0) _y = 0;
      if (_x > room.tilesWide) _x = room.tilesWide;
      if (_y > room.tilesWide) _y = room.tilesWide;

    }


    actor.goTo = function(_x, _y) {
      
          actor.tile().remove(actor);
       
          room.tile(_x, _y).add(actor);

    }


    return actor;

  }

});

Pxlqst.Enemy = Pxlqst.Actor.extend({

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

  }

});

Pxlqst.Item = Pxlqst.Thing.extend({

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var item = this;


    // keeps x, y in bounds
    item.take = function(_x, _y) {

      // user.inventory.add(item);

    }


    return item;

  }

});

Pxlqst.Wall = Pxlqst.Thing.extend({

  cssClass: 'wall',

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    // walls don't do anything. 

    return this;

  }

});

Pxlqst.Monster = Pxlqst.Enemy.extend({

  enemy: true,

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var monster = this;

    monster.cssClass = 'monster';


    monster.wander = function() {

      var newx = monster.x, newy = monster.y;

      // up/down OR left/right
      if (Math.random() > 0.5) newx = monster.x + parseInt(Math.random() * 3) - 1;
      else                     newy = monster.y + parseInt(Math.random() * 3) - 1;

      monster.confineToRoom(newx, newy);

      if (!room.tile(newx, newy).has(Pxlqst.Wall)) {

        monster.goTo(newx, newy);  

      }
 
    }


    monster.interval = setInterval(monster.wander, 2000);

    return monster;

  }

});

Pxlqst.Rat = Pxlqst.Enemy.extend({

  running: false,

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var rat = this;

    rat.cssClass = 'rat';


    rat.wander = function() {

      var newx = rat.x, newy = rat.y;

      // if not near a wall, run!
      if (!rat.tile().nextTo(Pxlqst.Wall)) {

        // run stupidly to nearest exterior room wall
        if      (rat.x < room.tilesWide / 2) newx -= 1;
        else if (rat.x > room.tilesWide / 2) newx += 1;
        else if (rat.y < room.tilesWide / 2) newy -= 1;
        else if (rat.y > room.tilesWide / 2) newy += 1;

      // rats are tentative!
      } else if (Math.random() > 0.2 || rat.running) {

        if (Math.random() > 0.3) rat.running = !rat.running;
 
        // run along wall
        if      (rat.tile().north().has(Pxlqst.Wall)) newx += parseInt(Math.random() * 3) - 1;
        else if (rat.tile().south().has(Pxlqst.Wall)) newx += parseInt(Math.random() * 3) - 1;
        else if (rat.tile().east().has(Pxlqst.Wall))  newy += parseInt(Math.random() * 3) - 1;
        else if (rat.tile().west().has(Pxlqst.Wall))  newy += parseInt(Math.random() * 3) - 1;
 

      }

      // actually move:
      rat.confineToRoom(newx, newy);

      // don't go through walls (do this in Actor ? but ghosts!)
      if (!room.tile(newx, newy).has(Pxlqst.Wall)) {

        rat.goTo(newx, newy);  

      }
 
    }


    rat.interval = setInterval(rat.wander, 500);

    return rat;

  }

});

Pxlqst.You = Pxlqst.Actor.extend({

  /*
    <profession> is like 'magician' and stuff.
  */
  init: function(x, y, profession, room) {

    // basic setup
    this._super(x, y, room);

    var you = this;

    you.cssClass = profession;


    you.walkToward = function(x, y) {

      you.destination = {x: x, y: y};

    }


    you.walk = function() {

      var newx = you.x, newy = you.y;

      if (you.destination) {

        if (Math.abs(you.destination.x - you.x) > Math.abs(you.destination.y - you.y)) {
          if (you.destination.x > you.x) newx = you.x + 1;
          else                           newx = you.x - 1;
        } else {
          if (you.destination.y > you.y) newy = you.y + 1;
          else                           newy = you.y - 1;
        }

        // don't go through walls (do this in Actor ? but ghosts!)
        if (!room.tile(newx, newy).has(Pxlqst.Wall)) {

          you.goTo(newx, newy);
 
        }

        if (you.x == you.destination.x && you.y == you.destination.y) you.destination = undefined;

        // take hit
        if (room.tile(newx, newy).has(Pxlqst.Enemy)) {

          you.tile().el.addClass('hit');

          setTimeout(function() {

            you.tile().el.removeClass('hit');

          }, 100);

        }

      }

    }

    you.interval = setInterval(you.walk, 500);

  }

});

Pxlqst.Torch = Pxlqst.Thing.extend({

  cssClass: 'torch',

  // Flickering torches!
  flickers: ['yellow', 'orange', '#f84', '#fa2', 'red'],

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var torch = this;

    torch.flicker = function() {

      torch.room.tile(x, y).el.css('background', torch.flickers[parseInt(Math.random() * torch.flickers.length)]);
   
    }


    torch.interval = setInterval(torch.flicker, 100);

    return torch;

  }

});
