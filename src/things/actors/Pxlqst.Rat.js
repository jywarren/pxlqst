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
