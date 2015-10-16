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

    // create health bar. Like a luna bar.
    for (var i = 0; i < you.health; i++) {
      $('.health').append('<div class="tile health-point"></div>');
    }


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

          if (room.tile(newx, newy).has(Pxlqst.Enemy)) {

            you.hit(); // take hit

          } else if (room.tile(newx, newy).has(Pxlqst.Item)) {

            if (room.tile(newx, newy).has(Pxlqst.Food)) {

              you.eat(room.tile(newx, newy).has(Pxlqst.Item));
              
            } else {

              // you get it!
              room.tile(newx, newy).has(Pxlqst.Item).take();

            }

            // de redundant this
            you.goTo(newx, newy);

          } else {

            you.goTo(newx, newy);

          }
 
        }

        if (you.x == you.destination.x && you.y == you.destination.y) you.destination = undefined;


      }

    }


    you.eat = function(food) {

      you.health += food.nutrition;

      food.tile().remove(food);

      you.heal(food.nutrition);

    }


    you.heal = function(amount) {

      for (var i = 0; i < amount && you.health <= 10; i++) {

        $('.health div:not(.health-point):first').addClass('health-point');

      }

    }


    you.hit = function() {

      you.tile().el.addClass('hit');

      you.health -= 1;
    
      setTimeout(function() {
    
        you.tile().el.removeClass('hit');
    
      }, 400);

      $('.health .health-point:last').removeClass('health-point');

    }

    you.interval = setInterval(you.walk, 500);

  }

});
