Pxlqst.Enemy = Pxlqst.Actor.extend({

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var enemy = this;

    this.tryHit = function(newx, newy) {

      // take hit
      if (enemy.room.tile(newx, newy).has(Pxlqst.You)) {

        enemy.room.tile(newx, newy).has(Pxlqst.You).hit();

        return true;

      } else return false;

    }

  }

});
