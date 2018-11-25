import { PriorityQueue } from './PriorityQueue';
import { Dictionary } from 'typescript-collections';

export interface IPosition
{
  GetHuristicDistance(to:IPosition): number;
  GetAdjacent(): Array<IPosition>;
  Equals(other:IPosition): boolean;
  toString(): string;
}

export class Pathfinder
{
  FindPath(from:IPosition, to:IPosition): Array<IPosition>
  {
    // [DistanceToGoal, Position]
    let UnexploredNodes:PriorityQueue<[number,IPosition]> = new PriorityQueue<[number,IPosition]>(
      (a,b) => { return a[0] <= b[0] }
    );
    // [Position, Parent]
    var ExpoloredNodes = new Dictionary<IPosition,IPosition|undefined>();

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
          if(ExpoloredNodes.containsKey(x) === false)
          {
            UnexploredNodes.Insert([x.GetHuristicDistance(to), x]);
            // It isn't actually explored yet, but being on UnexploredNodes gaurentees
            //   that it will get explored so it is safe to treat it as such.
            ExpoloredNodes.setValue(x, CurrentNode);
          }
        }
      );

    } while (CurrentNode.Equals(to) === false);

    // Trace back from CurrentNode to find the path
    let Path:Array<IPosition> = new Array();
    let pathNode:IPosition|undefined = CurrentNode;
    
    do {
      Path.push(pathNode);

      pathNode = ExpoloredNodes.getValue(pathNode); // Checked containsKey, so assert getValue is safe with '!'
      
      if (pathNode === undefined || pathNode === from)
        break;
    } while (ExpoloredNodes.containsKey(pathNode))

    return Path.reverse();
  }
}

export default Pathfinder;