Pxlqst.Torch = Pxlqst.Tool.extend({

  cssClass: 'torch',

  // Flickering torches!
  flickers: ['yellow', 'orange', '#f84', '#fa2', 'red'],

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var torch = this;

    torch.flicker = function() {

      torch.room.tile(torch.x, torch.y).el.css('background', torch.flickers[parseInt(Math.random() * torch.flickers.length)]);

    }


    torch.superMove = torch.move;
    torch.move = function(x, y) {

      torch.room.tile(torch.x, torch.y).el.css('background','');

      torch.superMove(x, y);

    }


    torch.interval = setInterval(torch.flicker, 100);

    return torch;

  }

});
