import { assert } from 'chai';
import { Pathfinder, SearchState, StateType, Agent } from '../src/PathFinder';
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

describe('SearchState - Single Agent, Generate Next State', function() {

  let map21 = new Map(
    [
      [true],
      [true]
    ]
  );

  var start = new Pos2D(0,0,map21);
  var end = new Pos2D(1,0,map21);

  var agent = new Agent(0, start, end);
  var aList = [agent];

  // Expect a standard state at timestep 1 with the agent at the end position

  it('Timestep and StateType are correct', function() {

    var startState = SearchState.MakeInitialState(aList);

    var nextState = startState.MakeNextState(agent, end);

    assert.strictEqual(nextState.timestep, 1);
    assert.strictEqual(nextState.state, StateType.Standard);
  });

  it('Agent list contains the agent', function() {

    var startState = SearchState.MakeInitialState(aList);

    var nextState = startState.MakeNextState(agent, end);

    assert.deepStrictEqual(nextState.agentMoveList.keys().map((x)=>x.id), [agent.id]);
  });
  
  it('Agent has moved', function() {

    var startState = SearchState.MakeInitialState(aList);

    var nextState = startState.MakeNextState(agent, end);

    assert.strictEqual(nextState.agentMoveList.keys()[0].location, end);
  });

});

describe('SearchState - Multi Agent, Generate multiple states', function() {
  
  let map22 = new Map(
    [
      [true, true],
      [true, true]
    ]
  );

  var start1 = new Pos2D(0,0,map22);
  var end1 = new Pos2D(1,0,map22);

  var start2 = new Pos2D(0,1,map22);
  var end2 = new Pos2D(1,1,map22);

  var a1 = new Agent(0, start1, end1);
  var a2 = new Agent(1, start2, end2);

  var aList = [a1, a2];

  it('Intermediate Timestep and StateType are correct', function() {

    var startState = SearchState.MakeInitialState(aList);

    var nextState = startState.MakeNextState(a1, end1);

    assert.strictEqual(nextState.timestep, 0);
    assert.strictEqual(nextState.state, StateType.Intermeditate);
  });
  
  it('Correct Agent has saved move', function() {

    var startState = SearchState.MakeInitialState(aList);

    var nextState = startState.MakeNextState(a1, end1);

    assert.strictEqual(nextState.agentMoveList.getValue(a1), end1);
  });
  
  it('Final state is correct', function() {

    var startState = SearchState.MakeInitialState(aList);

    var endState = startState.MakeNextState(a1, end1).MakeNextState(a2, end2);

    assert.strictEqual(endState.timestep, 1);
    assert.strictEqual(endState.state, StateType.Standard);

    var finalAgents = endState.agentMoveList.keys().sort((a,b)=>a.id-b.id);

    var f1 = new Agent(0, end1, end1);
    var f2 = new Agent(1, end2, end2);
  
    // Check for correct agent ids and locations
    assert.strictEqual(finalAgents[0].id, f1.id);
    assert.strictEqual(finalAgents[0].location, f1.location);
    assert.strictEqual(finalAgents[1].id, f2.id);
    assert.strictEqual(finalAgents[1].location, f2.location);
  });

});