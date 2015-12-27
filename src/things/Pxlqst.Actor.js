Pxlqst.Actor = Pxlqst.Thing.extend({

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var actor = this;

    // everyone gets 10 health to start with. EVERYONE
    actor.health = 10;
    actor.interval = 500;


    // keeps x, y in bounds
    actor.confineToRoom = function(_x, _y) {

      if (_x < 0) _x = 0;
      if (_y < 0) _y = 0;
      if (_x > actor.room.tilesWide) _x = actor.room.tilesWide;
      if (_y > actor.room.tilesWide) _y = actor.room.tilesWide;

    }


    actor.continuously = function(activity) {

      actor.activity = activity;

    }


    actor.sleep = function() {

      if (actor.timer) clearInterval(actor.timer);

    }


    actor.wake = function() {

      actor.timer = setInterval(actor.activity, actor.interval);

    }


    actor.hit = function(strength) {

      strength = strength || 1;

      actor.tile().el.addClass('hit');

      actor.health -= strength;

      console.log('I was hit and lost ', strength, ', leaving me at ', actor.health);
    
      setTimeout(function() {
    
        actor.tile().el.removeClass('hit');
    
      }, 400);

    };


    return actor;

  }

});
