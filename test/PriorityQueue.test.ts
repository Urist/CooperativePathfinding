import { should, assert } from 'chai';
import { PriorityQueue } from '../src/PriorityQueue';
should();

describe('Priority Queue Tests', function() {

  it('Number - Length is 0 when created', function() {
    var pq = new PriorityQueue<number>();
    assert.strictEqual(pq.length, 0);
  });

  it('Number - Insert gives length 1', function() {
    var pq = new PriorityQueue<number>();
    pq.Insert(42);
    var val = pq.length;
    assert.strictEqual(val, 1, `Should return: 1, but returned: ${val}`);
  });

  it('Number - Length is 0 when emptied', function() {
    var pq = new PriorityQueue<number>();
    pq.Insert(999);
    pq.Remove();
    assert.strictEqual(pq.length, 0);
  });

  it('Number - Multiple Insert gives correct length', function() {
    var pq = new PriorityQueue<number>();
    pq.Insert(1);
    pq.Insert(2);
    pq.Insert(3);
    pq.Insert(4);
    pq.Insert(5);
    var val = pq.length;
    assert.strictEqual(val, 5, `Should return: 5, but returned: ${val}`);
  });

  it('Number - Insert & Remove', function() {
    var pq = new PriorityQueue<number>();
    pq.Insert(42);
    var val = pq.Remove();
    assert.strictEqual(val, 42, `Should return: 42, but returned: ${val}`);
  });

  it('Number - Get all in correct order', function() {
    var pq = new PriorityQueue<number>();
    pq.Insert(3);
    pq.Insert(4);
    pq.Insert(5);
    pq.Insert(2);
    pq.Insert(1);
    let result:number[] = new Array();
    while (pq.length > 0)
    {
      result.push(pq.Remove());
    }
    assert.deepEqual(result, [5,4,3,2,1]);
  });

  it('Number - Multiple Insert Remove', function() {
    var pq = new PriorityQueue<number>();

    // Array of 1000 random values
    var valueList:number[] = new Array<number>(1000);
    for (let index = 0; index < 1000; index++) {
      valueList.push(Math.floor(Math.random()*100));
    }

    // Insert 5, remove 10 until we run out
    while(valueList.length > 0)
    {
      for (let index = 0; index < 10; index++) {
        var v = valueList.pop();
        if(v!==undefined) pq.Insert(v);
      }
      let [result, prev] = [100,100];
      for (let index = 0; index < 5; index++) {
        result = pq.Remove();
        // make sure the result is correct each time
        assert.isTrue(result <= prev, `${result} <= ${prev}`);
        prev = result;
      }
    }
    // Remove all, make sure the order is correct
    let [result, prev] = [100,100];
    while (pq.length > 0)
    {
      result = pq.Remove();
      assert.isTrue(result <= prev, `${result} <= ${prev}`);
      prev = result;
    }
  });

  it('Object - Get all in correct order', function() {

    class NumberObject { constructor(readonly n:number){} };
    var comp = function (a:NumberObject, b:NumberObject) { return a.n >= b.n };

    var pq = new PriorityQueue<NumberObject>(comp);
    pq.Insert(new NumberObject(1));
    pq.Insert(new NumberObject(2));
    pq.Insert(new NumberObject(3));
    pq.Insert(new NumberObject(5));
    pq.Insert(new NumberObject(4));
    let result:number[] = new Array();
    while (pq.length > 0)
    {
      result.push(pq.Remove().n);
    }
    assert.deepEqual(result, [5,4,3,2,1]);
  });
});