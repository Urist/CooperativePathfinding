import { assert } from 'chai';
import { SearchState, StateType } from '../src/SearchState';
import { Agent } from '../src/Agent';
import { Pos2D, Map } from '../src/Pos2D';

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
  
  describe('SearchState - Single Agent, GetHeuristicDistance', function() {
  
    let map31 = new Map(
      [
        [true],
        [true],
        [true]
      ]
    );
  
    var start = new Pos2D(0,0,map31);
    var middle = new Pos2D(1,0,map31);
    var end = new Pos2D(2,0,map31);
  
  
    it('Value is 0 at final position', function() {
  
      var agent = new Agent(0, end, end);
      var aList = [agent];
  
      var startState = SearchState.MakeInitialState(aList);
  
      assert.strictEqual(startState.GetHeuristicDistance(), 0);
    });
  
    it('Value is >0 at non-final position', function() {
  
      var agent = new Agent(0, start, end);
      var aList = [agent];
  
      var startState = SearchState.MakeInitialState(aList);
  
      assert.isTrue(startState.GetHeuristicDistance() > 0, `${startState.GetHeuristicDistance()} should be > 0`);
    });
  
    it('Further states have higher value', function() {
  
      var farAgent = new Agent(0, start, end);
      var midAgent = new Agent(0, middle, end);
  
      var farState = SearchState.MakeInitialState([farAgent]);
      var midState = SearchState.MakeInitialState([midAgent]);
  
      assert.isTrue(farState.GetHeuristicDistance() > midState.GetHeuristicDistance(),
        `Expected ${farState.GetHeuristicDistance()} > ${midState.GetHeuristicDistance()} to be true`);
    });
  });
  
  describe('SearchState - Single Agent, GetAdjacent', function() {
  
    let map31 = new Map(
      [
        [true],
        [true],
        [true]
      ]
    );
  
    var start = new Pos2D(0,0,map31);
    var middle = new Pos2D(1,0,map31);
    var end = new Pos2D(2,0,map31);
  
    var agent = new Agent(0, start, end);
  
    var startState = SearchState.MakeInitialState([agent]);
  
    it('Wait/Move Adjacent States', function() {
  
      assert.strictEqual(startState.GetAdjacent().length, 2);
    });
  
    it('Multpile Adjacent States', function() {
  
      var next = startState.MakeNextState(agent, middle);
  
      assert.strictEqual(next.GetAdjacent().length, 3);
    });
  });
  
  describe('SearchState - Single Agent, Equals', function() {
  
    let map31 = new Map(
      [
        [true],
        [true],
        [true]
      ]
    );
  
    var start = new Pos2D(0,0,map31);
    var middle = new Pos2D(1,0,map31);
    var end = new Pos2D(2,0,map31);
  
    var agent = new Agent(0, start, end);
  
    var startState = SearchState.MakeInitialState([agent]);
  
    it('Identity', function() {
      assert.isTrue(startState.Equals(startState));
    });
  
    it('Equivalence', function() {
  
      var altStartState = SearchState.MakeInitialState([agent]);
  
      assert.isTrue(startState.Equals(altStartState));
    });
  
    it('Coverged states are equal', function() {
  
      var converged1 = startState.MakeNextState(agent, middle);
  
      var altAgent = new Agent(0, end, end);
      var altStart = SearchState.MakeInitialState([altAgent]);
      var converged2 = altStart.MakeNextState(altAgent, middle);
  
      assert.isTrue(converged1.Equals(converged2));
    });
  
    it('Agents in differing locations', function() {
  
      var altAgent = new Agent(0, end, end);
      var altStart = SearchState.MakeInitialState([altAgent]);
  
      assert.isFalse(startState.Equals(altStart));
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
  
  describe('SearchState - Multi Agent, GetHeuristicDistance', function() {
  
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
  
    var a1 = new Agent(1, start1, end1);
    var a2 = new Agent(2, start2, end2);
  
    it('Value is 0 at final position', function() {
  
      var agent1 = new Agent(0, end1, end1);
      var agent2 = new Agent(0, end2, end2);
  
      var startState = SearchState.MakeInitialState([agent1, agent2]);
  
      assert.strictEqual(startState.GetHeuristicDistance(), 0);
    });
  
    it('Value is >0 at non-final position', function() {
  
      var agent1 = new Agent(1, start1, end1);
      var agent2 = new Agent(2, end2, end2);
  
      var startState = SearchState.MakeInitialState([agent1, agent2]);
  
      assert.isTrue(startState.GetHeuristicDistance() > 0, `${startState.GetHeuristicDistance()} should be > 0`);
    });
  
    it('Further states have higher value', function() {
  
      var agent1 = new Agent(0, start1, end1);
  
      var farAgent = new Agent(0, start2, end2);
      var midAgent = new Agent(0, end2, end2);
  
      var farState = SearchState.MakeInitialState([agent1, farAgent]);
      var midState = SearchState.MakeInitialState([agent1, midAgent]);
  
      assert.isTrue(farState.GetHeuristicDistance() > midState.GetHeuristicDistance(),
        `Expected ${farState.GetHeuristicDistance()} > ${midState.GetHeuristicDistance()} to be true`);
    });
  });
  
  describe('SearchState - Multi Agent, GetAdjacent', function() {
  
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
  
    var startState = SearchState.MakeInitialState([a1, a2]);
  
    it('Wait/Move Adjacent State Count', function() {
  
      assert.strictEqual(startState.GetAdjacent().length, 8);
    });
  
    it('Adjacent States from Intermediate', function() {
  
      var iState = startState.MakeNextState(a1, start2);
      var adjacentStates = iState.GetAdjacent()
      assert.strictEqual(adjacentStates.length, 2, adjacentStates.join('\n'));
    });
  });
  
  describe('SearchState - Multi Agent, Equals', function() {
    
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
  
    var startState = SearchState.MakeInitialState(aList);
  
    it('Identity', function() {
      assert.isTrue(startState.Equals(startState));
    });
  
    it('Equivalence', function() {
  
      var altStartState = SearchState.MakeInitialState(aList);
  
      assert.isTrue(startState.Equals(altStartState));
    });
  
    it('Coverged states are equal', function() {
  
      var converged1 = startState.MakeNextState(a2, end2);
  
      var altAgent = new Agent(a2.id, end1, end2);
      var altStart = SearchState.MakeInitialState([a1, altAgent]);
      var converged2 = altStart.MakeNextState(altAgent, end2);
  
      assert.isTrue(converged1.Equals(converged2));
    });
  });
  