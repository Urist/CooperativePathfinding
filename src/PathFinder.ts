import { PriorityQueue } from './PriorityQueue';
import { Dictionary } from 'typescript-collections';
import { DictionaryMap2ToArray } from './Utility';

export interface IPosition
{
  GetHeuristicDistance(to:IPosition): number;
  GetAdjacent(): Array<IPosition>;
  Equals(other:IPosition): boolean;
  toString(): string;

  Intersection(line1:[IPosition,IPosition],line2:[IPosition,IPosition]): boolean;
}

export class Agent
{
  // Agent class is immutable
  constructor(
    readonly id:number,
    readonly location:IPosition,
    readonly destination:IPosition
  ) {}

  moveTo(target:IPosition): Agent
  {
    return new Agent(this.id, target, this.destination);
  }

  equals(other:Agent): boolean
  {
    if (this.id === other.id)
    {
      if (this.destination.Equals(other.destination) === false)
      {
        throw new Error('Encountered Agents with same id but different destinations');
      }
      return true;
    }
    return false;
  }

  toString():string
  {
    return `Agent${this.id}`;
  }

  verboseToString():string
  {
    return `{${this.id}, ${this.location}, ${this.destination}}`;
  }
}

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
        new Agent(movingAgent.id, move, movingAgent.destination),
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
              new Agent(k.id, v, k.destination),
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
        // Skip un-assigned agents (Dictionary doesn't support filter sadly)
        if (assignment === undefined)
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

  Equals(other:SearchState): boolean
  {
    // Deep Equals, checks all fields for equality
    // AgentMoveList keys match all match using the Dictionary type's equality 
    // check for keys and strict equals for values 
    return this.timestep === other.timestep
      && this.state === other.timestep
      && DictionaryMap2ToArray(this.agentMoveList, other.agentMoveList,
        (_, va, vb) => va === vb
      ).every( (v) => v );
  }

  toString(): string
  {
    var agentString = this.agentMoveList.keys().map(
      (k) => `{${k.verboseToString} => ${this.agentMoveList.getValue(k)}}`
    );

    return `{${this.timestep}, ${this.state}, (${agentString.join('), (')})}`;
  }

}

export class Pathfinder
{

  FindMultiPath(agentList:Array<Agent>): Dictionary<Agent, Array<IPosition>>
  {
    // Setup initial and goal states
    let startState:SearchState = SearchState.MakeInitialState(agentList);
    let endState:SearchState = SearchState.MakeInitialState(agentList.map( (a) => a.moveTo(a.destination) ));

    // Setup data structures for search
    // [DistanceToGoal, State]
    let UnexploredNodes:PriorityQueue<[number,SearchState]> = new PriorityQueue<[number,SearchState]>(
      (a,b) => { return a[0] <= b[0] }
    );
    // [State, Parent State]
    var ExploredNodes = new Dictionary<SearchState,SearchState>();

    let CurrentNode:SearchState;

    // Setup initial state
    UnexploredNodes.Insert([startState.GetHeuristicDistance(), startState]);

    do {
      // If there are no more nodes to explore, fail to find a path
      if (UnexploredNodes.length === 0)
      {
        throw `No path from ${startState} to ${endState}`;        
      }

      // Get next node to explore
      CurrentNode = UnexploredNodes.Remove()[1];
      
      // Enumerate adjacent nodes and add them to the queue if they haven't been seen before
      CurrentNode.GetAdjacent().forEach(
        (x) =>
        {
          if(ExploredNodes.containsKey(x) === false)
          {
            UnexploredNodes.Insert([x.GetHeuristicDistance(), x]);
            // It isn't actually explored yet, but being on UnexploredNodes gaurentees
            //   that it will get explored so it is safe to treat it as such.
            ExploredNodes.setValue(x, CurrentNode);
          }
        }
      );

    } while (CurrentNode.Equals(endState) === false);

    // Trace back from CurrentNode to find final path through the search space
    let Path:Array<SearchState> = new Array();
    let pathNode:SearchState|undefined = CurrentNode;
    
    do {
      
      Path.push(pathNode);
      pathNode = ExploredNodes.getValue(pathNode);

    } while (pathNode !== undefined && pathNode !== startState && ExploredNodes.containsKey(pathNode))

    // Filter out Intermediate states, they are not used in creating the final path
    var standardStateList = Path.filter( (s) => s.state === StateType.Standard ).reverse();

    let finalAgentPathMap = new Dictionary<Agent, Array<IPosition>>();

    // Initialize the data structure to be returned
    standardStateList[0].agentMoveList.forEach(
      (agent, _) => finalAgentPathMap.setValue(agent, new Array<IPosition>())
    );

    // Go through each state and add each agents position to their final path
    standardStateList.forEach(
      (s) => s.agentMoveList.forEach(
        (agent, _) => 
          // Test cases validate that consecutive SearchState instances have the same agent list
          // making use of '!' here safe
          finalAgentPathMap.getValue(agent)!.push(agent.location)
      )
    );

    return finalAgentPathMap;
  }

  FindPath(from:IPosition, to:IPosition): Array<IPosition>
  {
    // [DistanceToGoal, Position]
    let UnexploredNodes:PriorityQueue<[number,IPosition]> = new PriorityQueue<[number,IPosition]>(
      (a,b) => { return a[0] <= b[0] }
    );
    // [Position, Parent]
    var ExploredNodes = new Dictionary<IPosition,IPosition>();

    let CurrentNode:IPosition;

    // Setup initial state
    UnexploredNodes.Insert([from.GetHeuristicDistance(to), from]);

    do {
      // If there are no more nodes to explore, fail to find a path
      if (UnexploredNodes.length === 0)
      {
        throw `No path from ${from} to ${to}`;        
      }

      // Get next node to explore
      CurrentNode = UnexploredNodes.Remove()[1];
      
      // Enumerate adjacent nodes and add them to the queue if they haven't been seen before
      CurrentNode.GetAdjacent().forEach(
        (x) =>
        {
          if(ExploredNodes.containsKey(x) === false)
          {
            UnexploredNodes.Insert([x.GetHeuristicDistance(to), x]);
            // It isn't actually explored yet, but being on UnexploredNodes gaurentees
            //   that it will get explored so it is safe to treat it as such.
            ExploredNodes.setValue(x, CurrentNode);
          }
        }
      );

    } while (CurrentNode.Equals(to) === false);

    // Trace back from CurrentNode to find the path
    let Path:Array<IPosition> = new Array();
    let pathNode:IPosition|undefined = CurrentNode;
    
    do {
      
      Path.push(pathNode);
      pathNode = ExploredNodes.getValue(pathNode);

    } while (pathNode !== undefined && pathNode !== from && ExploredNodes.containsKey(pathNode))

    return Path.reverse();
  }
}

export default Pathfinder;