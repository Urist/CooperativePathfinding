import { should } from 'chai';
import { PriorityQueue } from '../src/PriorityQueue';
should();

describe('Priority Queue Tests', function() {
  it('Number - Insert & Remove', function() {
  var pq = new PriorityQueue<number>();
  pq.Insert(42);
  var val = pq.Remove();
  val.should.equal(42, `Should return: 42, but returned: ${val}`);
  });
});