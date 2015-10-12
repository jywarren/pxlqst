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

    return object;

  }

});

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

Pxlqst.Monster = Pxlqst.Thing.extend({

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var monster = this;

    monster.cssClass = 'monster';


    monster.wander = function() {

      var newx = monster.x + parseInt(Math.random() * 3) - 1,
          newy = monster.y + parseInt(Math.random() * 3) - 1;

      // stay in bounds; we could abstract this to Pxlqst.Things or Pxlqst.Actors
      if (newx < 0) newx = 0;
      if (newy < 0) newy = 0;
      if (newx > room.tilesWide) newy = room.tilesWide;
      if (newy > room.tilesWide) newy = room.tilesWide;

      if (!(room.tile(newx, newy).objects[0] instanceof Pxlqst.Wall)) {

        room.tile(monster.x, monster.y).remove(monster);

        room.tile(newx, newy).add(monster);
        monster.x = newx;
        monster.y = newy;  

      }
 
    }


    monster.interval = setInterval(monster.wander, 2000);

    return monster;

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

Pxlqst.Wall = Pxlqst.Thing.extend({

  cssClass: 'wall',

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    // walls don't do anything. 

    return this;

  }

});
