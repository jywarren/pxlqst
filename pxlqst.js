window.addEventListener('load', function(e) {


  for (var y = 0; y < 16; y++) {

    $('.room').append("<div class='row row-" + y + "'></div>");

    for (var x = 0; x < 16; x++) {

      var row = $('.row-' + y).append("<div class='pixel floor column-" + x + " pixel-" + (y * 16 + x) + "'></div>");
      var pixel = row.find('.pixel:last');
      if (x == 0 || x == 15 || y == 0 || y == 15) pixel.addClass('wall');
      else if (Math.random() > 0.5) pixel.addClass('dark-floor');

    }

  }

  var width = $('.room').width();

  $('.pixel').width(  width / 17 )
             .height( width / 17 );

  // doors!

  $('.pixel-' + 16*8).removeClass('wall');
  $('.pixel-' + 11).removeClass('wall');


  // monsters!

  var monsterLocation = [5, 8];

  setInterval(function() {

    monsterLocation[0] += parseInt(Math.random() * 2) - 1;
    monsterLocation[1] += parseInt(Math.random() * 2) - 1;
    $('.monster').removeClass('monster');
    $('.row-' + monsterLocation[1] + ' .column-' + monsterLocation[0]).addClass('monster');

  }, 2000);


  $('.pixel-68').addClass('torch');

  // Flickering torches!
  var flickers = ['yellow', 'orange', '#f84', '#fa2', 'red'];
  setInterval(function() {

    var color = flickers[parseInt(Math.random() * flickers.length)]

    $('.torch').css('background', color);

  }, 100);

});
