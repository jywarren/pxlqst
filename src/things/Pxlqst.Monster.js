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
