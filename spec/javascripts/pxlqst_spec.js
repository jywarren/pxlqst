describe("You", function() {

  var world, room, you = it;

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
 
    // doors!
    // this is wrong; we should separate state from display: create Wall thing 
    room.tile( 0,  8).remove(room.tile( 0, 8).things[0]);
    room.tile(11,  0).remove(room.tile(11, 0).things[0]);
    
    // monsters!
    room.tile(12,  3).create(Pxlqst.Monster);
    
    // rats!
    room.tile(9, 11).create(Pxlqst.Rat);
    room.tile(4,  3).create(Pxlqst.Rat);
    
    // torch!
    room.tile( 4,  8).create(Pxlqst.Torch);
 
    // cake!
    room.tile(13, 12).create(Pxlqst.Cake);
 
    // stone!
    room.tile( 3, 12).create(Pxlqst.Stone);
 
    // sword!
    room.tile( 4,  5).create(Pxlqst.Sword);

    // disable cleanUp() method to persist the fixture across specs
    jasmine.getFixtures().cleanUp = function() { 
      //console.log('fake cleanUp'); 
    };

  });


  afterEach(function() {

    narrate('', false);

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

    },5000); // and we manage the time manually

  },6000);


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


});
