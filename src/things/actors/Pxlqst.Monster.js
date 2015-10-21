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
