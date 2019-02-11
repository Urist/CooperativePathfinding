import { PriorityQueue } from './PriorityQueue';
import { Dictionary } from 'typescript-collections';
import { IPosition } from './IPosition';
import { Agent } from './Agent';
import { SearchState, StateType } from './SearchState';

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

    } while (CurrentNode.IsEqvivalent(endState) === false);

    // DONE!
    // Now parse out the results

    // Trace back from CurrentNode to find final path through the search space
    let Path:Array<SearchState> = new Array();
    let pathNode:SearchState|undefined = CurrentNode;
    
    do {
      
      Path.push(pathNode);
      pathNode = ExploredNodes.getValue(pathNode);

    } while (pathNode !== undefined && ExploredNodes.containsKey(pathNode))

    // Filter out Intermediate states, they are not used in creating the final path
    var standardStateList = Path.filter( (s) => s.state === StateType.Standard ).reverse();

    let finalAgentPathMap = new Dictionary<Agent, Array<IPosition>>();

    // Initialize the data structure to be returned
    standardStateList[0].agentMoveList.forEach(
      (agent:Agent, _:any) => finalAgentPathMap.setValue(agent, new Array<IPosition>())
    );

    // Go through each state and add each agents position to their final path
    standardStateList.forEach(
      (s) => s.agentMoveList.forEach(
        (agent:Agent, _:any) => 
          // Test cases validate that consecutive SearchState instances have the same agent list
          // so use of '!' here is safe
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