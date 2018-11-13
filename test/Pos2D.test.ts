import { assert } from 'chai';
import { Pos2D } from '../src/Pos2D';

describe('Pos2D Tests', function() {

  let p0a = new Pos2D(0, 0, 0, 0);
  let p0b = new Pos2D(0, 0, 0, 0);
  let p1 = new Pos2D(1, 1, 2, 2);
  let p2 = new Pos2D(3, 4, 5, 5);

  it('Equals', function() {
    assert.isTrue(p0a.Equals(p0b));
    assert.isFalse(p0a.Equals(p1));
  });

  it('GetHuristicDistance', function() {
    assert.strictEqual(p0a.GetHuristicDistance(p0b), 0);
    assert.strictEqual(p0a.GetHuristicDistance(p2), 5);
  });

  it('ToString', function() {
    assert.strictEqual(p0a.ToString(), '(0,0)');
    assert.strictEqual(p1.ToString(), '(1,1)');
    assert.strictEqual(p2.ToString(), '(3,4)');
  });

  it('GetAdjacent', function() {
    assert.strictEqual(p0a.GetAdjacent().length, 0);
    assert.strictEqual(p1.GetAdjacent().join(), '(0,0)(0,1)(0,2)(1,0)(1,2)(2,0)(2,1)(2,2)');
  });
});
