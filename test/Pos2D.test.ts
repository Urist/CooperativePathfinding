import { assert } from 'chai';
import { Pos2D, Map } from '../src/Pos2D';

describe('Pos2D Tests', function() {

    let map11 = new Map(
        [
            [true]
        ]
    );

    let map33 = new Map(
        [
            [true, true, true],
            [true, true, true],
            [true, true, true]
        ]
    );

    let map51 = new Map(
        [
            [true, true, true, true, true]
        ]
    );

    let map55 = new Map(
        [
            [true, false, true, true, true],
            [true, false, true, false, true],
            [true, false, true, true, true],
            [true, false, true, false, true],
            [true, true, true, false, true]
        ]
    );

  let p0a = new Pos2D(0, 0, map11);
  let p0b = new Pos2D(0, 0, map11);
  let p1 = new Pos2D(1, 1, map33);
  let p2 = new Pos2D(3, 4, map55);

  it('Equals', function() {
    assert.isTrue(p0a.Equals(p0b));
    assert.isFalse(p0a.Equals(p1));
  });

  it('GetHeuristicDistance', function() {
    assert.strictEqual(p0a.GetHeuristicDistance(p0b), 0);
    assert.strictEqual(p0a.GetHeuristicDistance(p2), 5);
  });

  it('ToString', function() {
    assert.strictEqual(p0a.toString(), '(0,0)');
    assert.strictEqual(p1.toString(), '(1,1)');
    assert.strictEqual(p2.toString(), '(3,4)');
  });

  it('GetAdjacent', function() {
    assert.strictEqual(p0a.GetAdjacent().length, 1);
    assert.strictEqual(p1.GetAdjacent().join(''), '(0,0)(0,1)(0,2)(1,0)(1,1)(1,2)(2,0)(2,1)(2,2)');
  });
});
