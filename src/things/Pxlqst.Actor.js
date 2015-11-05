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

console.log('I was hit and lost ', strength, ', leaving me at ', actor.health);
    
      setTimeout(function() {
    
        actor.tile().el.removeClass('hit');
    
      }, 400);

    };


    return actor;

  }

});
