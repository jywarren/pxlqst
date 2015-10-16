Pxlqst.Torch = Pxlqst.Item.extend({

  cssClass: 'torch',

  // Flickering torches!
  flickers: ['yellow', 'orange', '#f84', '#fa2', 'red'],

  init: function(x, y, room) {

    // basic setup
    this._super(x, y, room);

    var torch = this;

    torch.flicker = function() {

      torch.room.tile(x, y).el.css('background', torch.flickers[parseInt(Math.random() * torch.flickers.length)]);
   
    }


    torch.interval = setInterval(torch.flicker, 100);

    return torch;

  }

});
