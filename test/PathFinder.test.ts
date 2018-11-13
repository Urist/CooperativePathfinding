import { assert } from 'chai';
import { Pathfinder } from '../src/PathFinder';
import { Pos2D } from '../src/Pos2D';

describe('PathFinder Tests', function() {

  it('Basic Functionality', function() {
    var pf = new Pathfinder();

    var from = new Pos2D(0, 0, 4, 1);
    var to = new Pos2D(4, 0, 4, 1);
    
    var path = pf.FindPath(from, to);

    assert.equal(path.join('->'), '(0,0)->(1,0)->(2,0)->(3,0)->(4,0)');
  });
});

/*
var from = new Pos2D(10, 10, 12, 12);
var to = new Pos2D(1, 1, 12, 12);
*/