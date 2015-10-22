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

  neighbors: {

    n: undefined,
    e: undefined,
    s: undefined,
    w: undefined

  },

  init: function(world, tilesWide) {

    var room = this;

    room.world = world; 
    room.tilesWide = tilesWide; 

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

    var thing = this;

    thing.x = x;
    thing.y = y;
    thing.room = room;


    thing.tile = function() {

      return room.tile(thing.x, thing.y);

    }


    // move to any tile, removing self from old tile
    thing.move = function(_x, _y) {
      
          thing.tile().remove(thing);
       
          room.tile(_x, _y).add(thing);

    }


    return thing;

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

      world.tileWidth = world.roomWidth / world.tilesWide - 4; // account for border-width

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

Pxlqst.Actor = Pxlqst.Thing.extend({

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var actor = this;

    // everyone gets 10 health to start with. EVERYONE
    actor.health = 10;

    // keeps x, y in bounds
    actor.confineToRoom = function(_x, _y) {

      if (_x < 0) _x = 0;
      if (_y < 0) _y = 0;
      if (_x > room.tilesWide) _x = room.tilesWide;
      if (_y > room.tilesWide) _y = room.tilesWide;

    }


    actor.hit = function(strength) {

      strength = strength || 1;

      actor.tile().el.addClass('hit');

      actor.health -= strength;
    
      setTimeout(function() {
    
        actor.tile().el.removeClass('hit');
    
      }, 400);

    };


    return actor;

  }

});

Pxlqst.Enemy = Pxlqst.Actor.extend({

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var enemy = this;

    this.tryHit = function(newx, newy) {

      // take hit
      if (room.tile(newx, newy).has(Pxlqst.You)) {

        room.tile(newx, newy).has(Pxlqst.You).hit();

        return true;

      } else return false;

    }

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
      console.log('you took the item!');

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

      if (!room.tile(newx, newy).has(Pxlqst.Wall) && !room.tile(newx, newy).has(Pxlqst.Stone)) {

        // try to hit You, but if not, go to newx, newy
        if (!monster.tryHit(newx, newy)) {
          monster.move(newx, newy);  
        }

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

      // don't go through walls, or obstacles (stone for now)
      if (!room.tile(newx, newy).has(Pxlqst.Wall) && !room.tile(newx, newy).has(Pxlqst.Stone)) {

        // try to hit You, but if not, go to newx, newy
        if (!rat.tryHit(newx, newy)) {
          rat.move(newx, newy);  
        }

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

    you.health = 10;
    you.held = false;

    // create health bar. Like a luna bar.
    for (var i = 0; i < you.health; i++) {
      $('.health').append('<div class="tile health-point"></div>');
    }


    you.walkToward = function(x, y, callback) {

      you.destination = { x: x, y: y, callback: callback };

    }


    you.walk = function() {

      var newx = you.x, newy = you.y;

      if (you.destination) {

//        you.stepTowards(you.destination.x, you.destination.y);

        if (Math.abs(you.destination.x - you.x) > Math.abs(you.destination.y - you.y)) {
          if (you.destination.x > you.x) newx = you.x + 1;
          else                           newx = you.x - 1;
        } else if (Math.abs(you.destination.x - you.x) < Math.abs(you.destination.y - you.y)) {
          if (you.destination.y > you.y) newy = you.y + 1;
          else                           newy = you.y - 1;
        }

        var tile = room.tile(newx, newy);

        // don't go through walls (do this in Actor ? but ghosts!)
        if (!tile.has(Pxlqst.Wall)) {

          if (tile.has(Pxlqst.Enemy)) {

            you.hit(); // take hit

          } else if (tile.has(Pxlqst.Item)) {

            var item = tile.has(Pxlqst.Item)

            if (item instanceof Pxlqst.Food) {

              you.eat(item);
              
            } else if (tile.has(Pxlqst.Item).pushable){

              if      (you.x > newx) item.move(newx - 1, newy);
              else if (you.x < newx) item.move(newx + 1, newy);
              else if (you.y > newy) item.move(newx, newy - 1); // this will never happen
              else if (you.y < newy) item.move(newx, newy + 1);

            } else {

              // you get it!
              console.log('took', item.cssClass);
              you.take(item);

            }

            // de redundant this
            you.move(newx, newy);

          } else {

            you.move(newx, newy);

          }
 
        }

        if (you.x == you.destination.x && you.y == you.destination.y) {

          console.log('you arrive at ', you.x, you.y);
          you.destination.callback();
          you.destination = undefined;

        }

      }

    }


    you.eat = function(food) {

      food.tile().remove(food);

      you.heal(food.nutrition);

    }


    you.heal = function(amount) {

      you.health += amount;

      for (var i = 0; i < amount && you.health <= 10; i++) {

        $('.health div:not(.health-point):first').addClass('health-point');

      }

    }


    you.take = function(item) {

      you.held = item;

    }


    // preserve super method
    you.superMove = you.move;
    you.move = function(x, y) {
 
      if (you.held) you.held.move(x, y - 1);

      return you.superMove(x, y);

    }


    // preserve super method
    you.superHit = you.hit;
    you.hit = function() {

      you.superHit();

      // empty them and repopulate
      $('.health .health-point').removeClass('health-point');
     
      for(var i = 0; i < you.health; i++) {
        $($('.health .tile')[i]).addClass('health-point');
      }

    }


    you.interval = setInterval(you.walk, 500);

  }

});

Pxlqst.Food = Pxlqst.Item.extend({

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var item = this;

    return item;

  }

});

Pxlqst.Stone = Pxlqst.Item.extend({

  cssClass: 'stone',

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var stone = this;

    stone.pushable = true;

    return stone;

  }

});

Pxlqst.Tool = Pxlqst.Item.extend({

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var tool = this;

    return tool;

  }

});

Pxlqst.Cake = Pxlqst.Food.extend({

  cssClass: 'cake',

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var cake = this;

    cake.nutrition = 2;

    return cake;

  }

});

Pxlqst.Sword = Pxlqst.Tool.extend({

  cssClass: 'sword',

  // Can we do a sword shimmering in the light?
  //shimmers: ['yellow', 'orange', '#f84', '#fa2', 'red'],

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var sword = this;

    // also, don't enter the tile if it's occupied.
    // move should return true or false!
    //sword.use = function(tile) {
    //sword.superMove = sword.move;
    sword.use = function(x, y) {

      if (sword.room.tile(x, y).has(Pxlqst.Actor)) {

        sword.room.tile(x, y).has(Pxlqst.Actor).hit();

        sword.superUse(x, y);

        return true; // when switching to use(), return if it was used

      } else return false;

    }


    return sword;

  }

});

Pxlqst.Torch = Pxlqst.Tool.extend({

  cssClass: 'torch',

  // Flickering torches!
  flickers: ['yellow', 'orange', '#f84', '#fa2', 'red'],

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var torch = this;

    torch.flicker = function() {

      torch.room.tile(torch.x, torch.y).el.css('background', torch.flickers[parseInt(Math.random() * torch.flickers.length)]);

    }


    torch.superMove = torch.move;
    torch.move = function(x, y) {

      torch.room.tile(torch.x, torch.y).el.css('background','');

      torch.superMove(x, y);

    }


    torch.interval = setInterval(torch.flicker, 100);

    return torch;

  }

});
