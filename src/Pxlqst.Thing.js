Pxlqst.Thing = Class.extend({

  init: function(x, y, room) {

    var object = this;

    object.x = x;
    object.y = y;
    object.room = room;


    object.tile = function() {

      return room.tile(object.x, object.y);

    }


    return object;

  }

});
