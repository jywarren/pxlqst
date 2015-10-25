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
        } else {
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
            console.log('step');

          } else {

            you.move(newx, newy);
            console.log('step');

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
