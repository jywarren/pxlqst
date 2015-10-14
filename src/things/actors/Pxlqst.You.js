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
