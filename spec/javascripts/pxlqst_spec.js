var world, room, you = it;

describe("You", function() {

  var narrate = function(txt, subject) {

    if (subject === false) subject = '';

    else subject = subject || "You";

    // eventually, we could just have it grab the spec text... not sure how at this point.
    $('.narration').html(subject + " " + txt);

  }

  // it'd be great not to have to re-initialize world after each spec, but beforeAll fixtures
  // still get torn down after each spec, it seems, with cleanUp(). Boo. We could use this as an opportunity
  // to develop game save-state functionality, though...
  beforeAll(function() {

    fixture = loadFixtures('index.html');

    world = new Pxlqst.World();
 
    room = world.room;
 
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
  
  
    var map = [

    // 0123456789abcdef  
      '00000000 0000000', // 0
      '0              0', // 1
      '0              0', // 2
      '0   r       Z  0', // 3
      '0              0', // 4
      '0   s          0', // 5
      '0               ', // 6
      '0              0', // 7
      '0   t          0', // 8
      '0          r   0', // 9
      '0              0', // a
      '   r           0', // b
      '0  S           0', // c
      '0              0', // d
      '0              0', // e
      '0000 00000000000'  // f
  
    ]

    room.read(map, key);

    // disable cleanUp() method to persist the fixture across specs
    jasmine.getFixtures().cleanUp = function() { 
      //console.log('fake cleanUp'); 
    };

  });


  afterEach(function() {

    narrate('', false); // clear the narration element

  });


  // Because of zombie randomness, you'll sometimes 
  // die unexpectedly during the test adventure. Hmm.


  you("walk west toward the torch and arrive there shortly after.", function(done) {

    narrate("walk west toward the torch and arrive there shortly after.");

    world.you.walkToward(5, 8, function() {

      expect(world.you.x).toBe(5);
      expect(world.you.y).toBe(8);

      done();

    });

  });


  you("walk west one step and pick up the torch.", function(done) {

    narrate("walk west one step and pick up the torch.");

    expect(world.you.x).toBe(5);
    expect(world.you.y).toBe(8);

    world.you.walkToward(4, 8, function() {

      expect(world.you.x).toBe(4);
      expect(world.you.y).toBe(8);
      expect(world.you.held instanceof Pxlqst.Torch).toBe(true);

      done();

    });

  });


  you("are compelled by a mysterious force to carry the torch across the room.", function(done) {

    narrate("are compelled by a mysterious force to carry the torch across the room.");

    room.tile(9, 11).el.click()

    // we use a timeout since our click event doesn't have a callback
    setTimeout(function() {

      expect(world.you.x).toBe(9);
      expect(world.you.y).toBe(11);
      expect(world.you.held instanceof Pxlqst.Torch).toBe(true);

      done();

    }, 5000); // and we manage the time manually

  }, 6000);


  you("decide to try pushing the stone.", function(done) {

    narrate("decide to try pushing the stone.");

    world.you.walkToward(3, 12, function() {

      expect(world.you.x).toBe(3);
      expect(world.you.y).toBe(12);
      expect(world.you.held instanceof Pxlqst.Torch).toBe(true);
      expect(world.you.tile().has(Pxlqst.Stone)).toBe(false);
      expect(room.tile(world.you.x - 1, world.you.y).has(Pxlqst.Stone)).not.toBe(false);

      done();

    });

  });


  you("see a cake appear behind you, go over and eat it, and feel better.", function(done) {

    narrate("see a cake appear in front of you, go over and eat it, and feel better.");
 
    expect(world.you.health).toBe(10);
    expect(room.tile(13, 12).has(Pxlqst.Cake)).toBe(false);

    // cake!
    room.tile(13, 12).create(Pxlqst.Cake);

    expect(room.tile(13, 12).has(Pxlqst.Cake)).not.toBe(false);

    world.you.walkToward(13, 12, function() {

      expect(world.you.x).toBe(13);
      expect(world.you.y).toBe(12);
      expect(world.you.health).toBe(12);

      setTimeout(function() {

        expect(room.tile(13, 12).has(Pxlqst.Cake)).toBe(false);

        done();

      }, 1000);

    });

  }, 7000);


  // this test fails for two important reasons; in order:
  // 1. you get stuck on the doorframe
  // 2. your torch gets stuck on the edge of reality
  xit("walk through the door to the north.", function(done) {

    narrate("walk through the door to the north.");

    var firstRoomId = world.room.id,
        northRoomId = world.room.neighbors['n'].id;

    world.you.walkToward(8, 0, function() {

      expect(world.you.x).toBe(8);
      expect(world.you.y).toBe(0);

      expect(world.room.id).not.toBe(firstRoomId); // you will not be in the same room anymore!
      expect(world.room.id).toBe(northRoomId); // you will be in the room to the north

      done();

    });

  }, 10000);


});
