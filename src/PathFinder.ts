import { PriorityQueue } from './PriorityQueue';
import { Dictionary } from 'typescript-collections';

/*
TODO: Restrict agent movement (stop them walking through each other)
TODO: Calculate huristic for SearchState
TODO: Replace manual moving of agents with Agent::moveTo()
REFACTOR: Create a SearchState inferface?
*/

export interface IPosition
{
  GetHuristicDistance(to:IPosition): number;
  GetAdjacent(): Array<IPosition>;
  Equals(other:IPosition): boolean;
  toString(): string;
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

  toString():string
  {
    return `Agent${this.id}`;
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

  GetHuristicDistance(): number
  {
    throw 'SearchState::GetHuristicDistance not implemented';
  }

  GetAdjacent(): Array<SearchState>
  {
    throw 'SearchState::GetAdjacent not implemented';
  }

  Equals(other:SearchState): boolean
  {
    throw 'SearchState::Equals not implemented';
  }

  toString(): string
  {
    throw 'SearchState::toString not implemented';
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
    UnexploredNodes.Insert([startState.GetHuristicDistance(), startState]);

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
            UnexploredNodes.Insert([x.GetHuristicDistance(), x]);
            // It isn't actually explored yet, but being on UnexploredNodes gaurentees
            //   that it will get explored so it is safe to treat it as such.
            ExploredNodes.setValue(x, CurrentNode);
          }
        }
      );

    } while (CurrentNode.Equals(endState) === false);

    // Trace back from CurrentNode to find the path
    let Path:Array<SearchState> = new Array();
    let pathNode:SearchState|undefined = CurrentNode;
    
    do {
      
      Path.push(pathNode);
      pathNode = ExploredNodes.getValue(pathNode);

    } while (pathNode !== undefined && pathNode !== startState && ExploredNodes.containsKey(pathNode))

    var standardStateList = Path.filter( (s) => s.state === StateType.Standard );

    let agentPathList = new Dictionary<Agent, Array<IPosition>>();

    // TODO: Extract agent paths from search states

    return Path.reverse();
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
    UnexploredNodes.Insert([from.GetHuristicDistance(to), from]);

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
            UnexploredNodes.Insert([x.GetHuristicDistance(to), x]);
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