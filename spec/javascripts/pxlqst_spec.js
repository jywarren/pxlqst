describe("You", function() {

  var world, room, you = it;


  beforeEach(function() {

    fixture = loadFixtures('index.html');

    world = new Pxlqst.World();
 
    room = world.currentRoom;
 
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

  });


  you("walk west toward the torch and arrive there shortly after", function(done) {

    world.you.walkToward(5, 8, function() {

      expect(world.you.x).toBe(5);
      expect(world.you.y).toBe(8);

      done();

    });

  });


  you("walk west one step and pick up the torch", function(done) {

    world.you.move(5, 8);

    world.you.walkToward(4, 8, function() {

      expect(world.you.x).toBe(4);
      expect(world.you.y).toBe(8);
      expect(world.you.held instanceof Pxlqst.Torch).toBe(true);

      done();

    });

  });


});
