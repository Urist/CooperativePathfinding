import { Dictionary } from 'typescript-collections';
import { IPosition } from './IPosition';
import { Agent } from './Agent';
import { DictionaryMap2ToArray } from "./Utility";

export enum StateType
{
  Intermeditate,
  Standard,
}

// Exported for testing purposes
export class SearchState
{
  // SearchState class is immutable
  private constructor(
		readonly timestep:number,
		readonly state:StateType,
		readonly agentMoveList:Dictionary<Agent, IPosition|null>
  ) {}

  static MakeInitialState(agentList:Array<Agent>)
  {
    var tmpDict = new Dictionary<Agent, IPosition|null>();

    agentList.forEach(
      (a) => tmpDict.setValue(a, null)
    );

    return new SearchState(
      0,
      StateType.Standard,
      tmpDict
    );
  }

  MakeNextState(movingAgent:Agent, move:IPosition)
  {
    if (this.agentMoveList.containsKey(movingAgent) === false)
      throw `SearchState Agent list does not contains ${movingAgent}`;

    if (this.agentMoveList.getValue(movingAgent) !== null)
      throw `SearchState attempted to re-assign move to ${movingAgent}`;

    var unassignedAgents =
      this.agentMoveList.keys().filter( (k) => this.agentMoveList.getValue(k) === null );
    
    if (unassignedAgents.length === 1)
    {
      // Including the move passed in, all agents have moves assigned
      // Therefore the new state will be a Standard state

      // Make extra sure that the unassigned agent is actually the one that is being moved
      if (unassignedAgents[0].id !== movingAgent.id)
        throw `Expected unassigned agent to be ${movingAgent}, but it was ${unassignedAgents[0]}`;

      // Create a new Agent list with each agent moved to it's target position
      var newAgentList:Dictionary<Agent, IPosition|null> = new Dictionary();
      // Set the moving agent's position
      newAgentList.setValue(
        movingAgent.moveTo(move),
        null
      );
      // Copy agents and update their positions
      this.agentMoveList.forEach(
        (k, v) =>
        {
          if (k.id !== movingAgent.id) // Skip over agent that moved, it was added above
          {
            if (v === null)
            throw `Found null move for ${k} when generating Standard state`;

            newAgentList.setValue(
              k.moveTo(v),
              null
            );
          }
        }
      );

      return new SearchState(
        this.timestep + 1,
        StateType.Standard,
        newAgentList
      );

    }
    else
    {
      // This is still an Intermediate state

      // Create a copy of the Agent list
      // A new agent is generated when it moves, so we can reuse them here
      var newAgentList:Dictionary<Agent, IPosition|null> = new Dictionary();
      this.agentMoveList.forEach(
        (k, v) => newAgentList.setValue(k, v)
      );
      // Don't forget to save the new move (but don't execute it yet)
      newAgentList.setValue(
        movingAgent,
        move
      );

      return new SearchState(
        this.timestep,
        StateType.Intermeditate,
        newAgentList
      );
    }
  }

  GetHeuristicDistance(): number
  {
    let HeuristicValue:number = 0;

    this.agentMoveList.forEach(
      (agent, assignedMove) =>
      {
        if (assignedMove !== null)
        {
          HeuristicValue += assignedMove.GetHeuristicDistance(agent.destination);
        }
        else
        {
          HeuristicValue += agent.location.GetHeuristicDistance(agent.destination);
        }
      }
    );

    return HeuristicValue;
  }

  private _isCollidingMove(testAgent:Agent, testMove:IPosition):boolean
  {
    let isCollidingMove:boolean = false;

    this.agentMoveList.forEach(
      (otherAgent, otherMove) =>
      {
        // If neither agent has a moved assigned, anything is allowed
        if (otherMove !== null)
        {
          // Test if moves would swap or cross
          if (testMove.Intersection([testAgent.location, testMove], [otherAgent.location, otherMove]))
          {
            isCollidingMove = true;
            return false;
          }
          // Moving into the space occupied by an agent that is 'wait'ing is not allowed
          if (testMove.Equals(otherAgent.location) && otherAgent.location.Equals(otherMove))
          {
            isCollidingMove = true;
            return false;
          }
        }
      }
    );

    return isCollidingMove;
  }

  GetAdjacent(): Array<SearchState>
  {
    var resultList = new Array<SearchState>();

    // Each 'adjacent' state has one agent moved
    // Only agents without a move assigned in the current state can move though
    // so generate a new state for each non-colliding move each unassigned agent could make
    this.agentMoveList.forEach(
      (agent, assignment) =>
      {
        // Skip assigned agents (Dictionary doesn't support filter sadly)
        if (assignment === null)
        {
          agent.location
          .GetAdjacent()
          .filter(
            (newPos) => this._isCollidingMove(agent, newPos) === false
          )
          .forEach(
            (newPos) => resultList.push(this.MakeNextState(agent, newPos))
          );
        }
      }
    );

    return resultList;

  }

  /**
   * Check if states are of the same type (Standard/Intermediate) and have the same agents in the same positions with the same planned moves.
   * @param other SearchState to compare against
   */
  IsEqvivalent(other:SearchState): boolean
  {
    // Deep Equals, checks all fields for equality
    // AgentMoveList keys match all match using the Dictionary type's equality 
    // check for keys and strict equals for values 

    var listA = (this.agentMoveList.keys() as Array<Agent>).sort();
    var listB = (other.agentMoveList.keys() as Array<Agent>).sort();
    let StatesHaveSameAgents:boolean = listA.map(
      (agent, index) => agent.deepEquals(listB[index])
    ).every((x)=>x);

    return this.state === other.state
      && StatesHaveSameAgents
      && DictionaryMap2ToArray(this.agentMoveList, other.agentMoveList,
        (_, va, vb) => va === vb || (va != null && vb != null && va.Equals(vb))
      ).every( (v) => v );
  }

  /**
   * Like IsEquivalent but also checks that states took the same amount of time to reach the current position.
   * @param other SearchState to compare against
   */
  IsIdentical(other:SearchState): boolean
  {
    return this.timestep === other.timestep
      && this.IsEqvivalent(other);
  }

  toString(): string
  {
    let agentString:string[] = this.agentMoveList.keys().map(
      (k) => `${k.verboseToString()} => ${this.agentMoveList.getValue(k)}`
    );

    return `{${this.timestep}, ${this.state}, (${agentString.join('), (')})}`;
  }

}
