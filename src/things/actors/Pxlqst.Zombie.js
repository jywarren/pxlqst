Pxlqst.Zombie = Pxlqst.Enemy.extend({

  enemy: true,

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var zombie = this;

    zombie.cssClass = 'zombie';

    zombie.interval = 1500;


    zombie.wander = function() {

      var newx = zombie.x, newy = zombie.y;

      // up/down OR left/right
      if (Math.random() > 0.5) newx = zombie.x + parseInt(Math.random() * 3) - 1;
      else                     newy = zombie.y + parseInt(Math.random() * 3) - 1;

      zombie.confineToRoom(newx, newy);

      if (!zombie.room.tile(newx, newy).has(Pxlqst.Wall) && !zombie.room.tile(newx, newy).has(Pxlqst.Stone)) {

        // try to hit You, but if not, go to newx, newy
        if (!zombie.tryHit(newx, newy)) {
          zombie.move(newx, newy);  
        }

      }
 
    }

    zombie.continuously(zombie.wander);


    return zombie;

  }

});
