import { assert } from 'chai';
import { Pathfinder } from '../src/PathFinder';
import { Pos2D, Map } from '../src/Pos2D';

describe('PathFinder Tests', function() {

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

    assert.equal(path.join('->'), '(0,0)->(1,0)->(2,0)->(3,0)->(4,0)');
  });

  it('Non-trivial pathing', function() {
    var pf = new Pathfinder();

    let map55 = new Map(
      [
        [true, false, true, true, true],
        [true, false, true, false, true],
        [true, false, true, true, true],
        [true, false, true, false, true],
        [true, true, true, false, true]
      ]
    );

    var from = new Pos2D(0, 0, map55);
    var to = new Pos2D(4, 4, map55);
    
    var path = pf.FindPath(from, to);

    assert.equal(path.join('->'), '(0,0)->(1,0)->(2,0)->(3,0)->(4,0)');
  });
});

/*
var from = new Pos2D(10, 10, 12, 12);
var to = new Pos2D(1, 1, 12, 12);
*/