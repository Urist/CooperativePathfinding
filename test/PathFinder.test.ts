import { assert } from 'chai';
import { Pathfinder } from '../src/PathFinder';
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
