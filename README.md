### pxlqst

A pixel quest.

Try it at http://pxlqst.com


## Rules

1. No objects larger than 1x1 pixels
2. No text

****

## Setup

1. From the root directory, run `bower install`.
2. Open index.html in a browser.

## Contributing

1. This project uses `grunt` to do a lot of things, including concatenate source files from /src/ to pxlqst.js. Run `npm install` or `sudo npm install` from the root directory to install Grunt if you don't have it already. 
2. You may need to install grunt-cli: `npm install -g grunt-cli`.
3. Run `grunt` in the root directory, and it will watch for changes and concatenate them on the fly.

## Test adventure

Pxlqst comes with a [test suite](https://github.com/jywarren/pxlqst/issues/4) using [Jasmine](https://jasmine.github.io) which lead the tester on an adventure through the dungeons. To run this test adventure, visit http://pxlqst.com/test or when you're running it locally, open test.html in a browser.

****

## Game setup

See the index.html file for basic DOM layout; at minimum, you'll need to include jquery and the pxlqst CSS and JS files:

````html

<link href="pxlqst.css" rel="stylesheet">
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="pxlqst.js"></script>

<script>

  var world = new Pxlqst.World();

</script>

````

But this will result in an empty room, in an empty world. How sad! Read on:

## Map editor

To create maps, feed the Room a map object, which is an array of (string) tile rows using the tile type symbols defined in the key (see below). Maps are (by default) 16x16, obviously. Sound hard? Look at this simple example:

````js

var map = [

// 0123456789abcdef  
  '00000000 0000000', // 0
  '0              0', // 1
  '0              0', // 2
  '0   r       Z  0', // 3   <= a Rat and a Zombie
  '0              0', // 4  
  '0   s          0', // 5   <= a Sword
  '0               ', // 6   <= a Door indicated by an opening in the Wall
  '0              0', // 7  
  '0   t          0', // 8   <= a Torch
  '0          r   0', // 9   <= another Rat
  '0              0', // a  
  '   r           0', // b   <= a third Rat
  '0  S         c 0', // c   <= a Stone and a Cake
  '0              0', // d
  '0              0', // e
  '0000 00000000000'  // f

]

// read the map into the room:
world.room.read(map);

````

## Tile keys

A map key is an associative array defining your tile types. The default tile key is as follows, but you can override or add to it by editing any `room.key` -- keys are kept by room so that different tilesets or appearances can be displayed in different rooms. 

````js

var key = {

  ' ': false, // floor
  '0': Pxlqst.Wall,
  'X': Pxlqst.You,
  'Z': Pxlqst.Zombie,
  'r': Pxlqst.Rat,
  't': Pxlqst.Torch,
  'S': Pxlqst.Stone,
  's': Pxlqst.Sword,
  'c': Pxlqst.Cake

}

````
