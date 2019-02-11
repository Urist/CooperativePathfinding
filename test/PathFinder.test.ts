import { assert } from 'chai';
import { Pathfinder } from '../src/PathFinder';
import { Agent } from '../src/Agent';
import { Pos2D, Map } from '../src/Pos2D';

describe('PathFinder Tests', function() {

  let map55 = new Map(
    [
      [true, false, true, true, true],
      [true, false, true, false, true],
      [true, false, true, true, true],
      [true, false, true, false, true],
      [true, true, true, false, true]
    ]
  );

  it('Basic Functionality', function() {
    var pf = new Pathfinder();

    let map51 = new Map(
      [
        [true],
        [true],
        [true],
        [true],
        [true]
      ]
    );

    var from = new Pos2D(0, 0, map51);
    var to = new Pos2D(4, 0, map51);
    
    var path = pf.FindPath(from, to);

    assert.equal(path.join('->'), '(1,0)->(2,0)->(3,0)->(4,0)');
  });

  it('Non-trivial pathing', function() {
    var pf = new Pathfinder();

    var from = new Pos2D(0, 0, map55);
    var to = new Pos2D(4, 4, map55);
    
    var path = pf.FindPath(from, to);

    assert.equal(path.join('->'), '(1,0)->(2,0)->(3,0)->(4,1)->(3,2)->(2,3)->(3,4)->(4,4)');
  });

  it('Non-trivial pathing (reverse)', function() {
    var pf = new Pathfinder();

    var from = new Pos2D(4, 4, map55);
    var to = new Pos2D(0, 0, map55);
    
    var path = pf.FindPath(from, to);

    assert.equal(path.join('->'), '(3,4)->(2,3)->(3,2)->(4,1)->(3,0)->(2,0)->(1,0)->(0,0)');
  });

  it('Zero distance pathing', function() {
    var pf = new Pathfinder();

    var from = new Pos2D(2, 2, map55);
    var to = new Pos2D(2, 2, map55);
    
    var path = pf.FindPath(from, to);

    assert.equal(path.join('->'), '(2,2)');
  });

  it('Impossible path fails pathing', function() {
    var pf = new Pathfinder();

    var from = new Pos2D(4, 4, map55);
    var to = new Pos2D(-1, -1, map55);
    
    try {
      var path = pf.FindPath(from, to);
      assert.fail(path); // What path did it find???
    } catch (error) {
      assert.isTrue(true); // Impossible path is expected to throw
    }
  });
});

describe('PathFinder - FindMultiPath', function() {

  it('FindMultiPath Trivial Functionality', function() {
    var pf = new Pathfinder();

    let map22 = new Map(
      [
        [true, true],
        [true, false]
      ]
    );

    var agentList = 
    [
      new Agent(100, new Pos2D(0,0,map22), new Pos2D(0,1,map22)),
      new Agent(101, new Pos2D(1,0,map22), new Pos2D(1,0,map22))
    ];
    
    var path = pf.FindMultiPath(agentList);

    var pathString = '';
    path.forEach( (k,v) => pathString = pathString.concat(`${k} - ${v.join('->')}\n`) );

    assert.equal(pathString, 'Agent101 - (1,0)\nAgent100 - (0,1)\n');
  });

  it('FindMultiPath Basic Functionality', function() {
    var pf = new Pathfinder();

    let map33 = new Map(
      [
        [true, true, true],
        [true, true, true],
        [true, true, true]
      ]
    );

    var agentList = 
    [
      new Agent(100, new Pos2D(0,0,map33), new Pos2D(0,2,map33)),
      new Agent(101, new Pos2D(1,0,map33), new Pos2D(1,2,map33)),
      new Agent(102, new Pos2D(2,0,map33), new Pos2D(2,2,map33))
    ];
    
    var path = pf.FindMultiPath(agentList);

    var pathString = '';
    path.forEach( (k,v) => pathString = pathString.concat(`${k} - ${v.join('->')}\n`) );

    assert.equal(pathString, 'Agent102 - (2,1)->(2,2)\nAgent100 - (0,1)->(0,2)\nAgent101 - (1,1)->(1,2)\n');
  });

  it('FindMultiPath Circular Pathing', function() {
    var pf = new Pathfinder();

    let map33 = new Map(
      [
        [false, true],
        [true, true],
      ]
    );

    var agentList = 
    [
      new Agent(101, new Pos2D(1,0,map33), new Pos2D(1,1,map33)),
      new Agent(102, new Pos2D(1,1,map33), new Pos2D(0,1,map33)),
      new Agent(103, new Pos2D(0,1,map33), new Pos2D(1,0,map33))
    ];
    
    var path = pf.FindMultiPath(agentList);

    var pathString = '';
    path.forEach( (k,v) => pathString = pathString.concat(`${k} - ${v.join('->')}\n`) );

    assert.equal(pathString, 'Agent102 - (0,1)\nAgent101 - (1,1)\nAgent103 - (1,0)\n');
  });

  it('FindMultiPath Blocked Agent', function() {
    var pf = new Pathfinder();

    let map = new Map(
      [
        [true, false, false, false],
        [true, true, true, true]
      ]
    );

    var agentList = 
    [
      new Agent(101, new Pos2D(1,1,map), new Pos2D(3,1,map)),
      new Agent(102, new Pos2D(2,1,map), new Pos2D(0,1,map))
    ];
    
    var path = pf.FindMultiPath(agentList);

    var pathString = '';
    path.forEach( (k,v) => pathString = pathString.concat(`${k} - ${v.join('->')}\n`) );

    assert.equal(pathString, 'TBD');
  });

  it('FindMultiPath Dodging Agent', function() {
    var pf = new Pathfinder();

    let map = new Map(
      [
        [true, false, true, true, true],
        [false, true, false, false, false],
        [true, false, false, false, false],
        [false, true, true, true, false]
      ]
    );

    var agentList = 
    [
      new Agent(900, new Pos2D(1,1,map), new Pos2D(1,1,map)),
      new Agent(101, new Pos2D(1,3,map), new Pos2D(4,0,map)),
      new Agent(102, new Pos2D(3,3,map), new Pos2D(3,0,map))
    ];
    
    var path = pf.FindMultiPath(agentList);

    var pathString = '';
    path.forEach( (k,v) => pathString = pathString.concat(`${k} - ${v.join('->')}\n`) );

    assert.equal(pathString, 'TBD');
  });

});
