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
      (a,b) => { return a[0] >= b[0] }
    );
    // [Position, Parent]
    var ExpoloredNodes = new Dictionary<IPosition,IPosition>();

    let CurrentNode:IPosition;

    // Setup initial state
    UnexploredNodes.Insert([from.GetHuristicDistance(to), from]);

    do {
      CurrentNode = UnexploredNodes.Remove()[1];

      if(CurrentNode.Equals(to))
        break; // Done!
      
      // Enumerate adjactent nodes and add them to the queue if they haven't been seen before
      CurrentNode.GetAdjacent().forEach(
        (x) =>
        {
          if(ExpoloredNodes.containsKey(x) === false)
          {
            UnexploredNodes.Insert([x.GetHuristicDistance(to), x]);
          }
        }
      );

    } while (true);

    let Path:Array<IPosition> = new Array();
    Path.push(CurrentNode);

    // Trace back from CurrentNode to find the path
    while (ExpoloredNodes.containsKey(CurrentNode)) {
      CurrentNode = ExpoloredNodes.getValue(CurrentNode)!; // Checked containsKey, so assert getValue is safe with '!'
      Path.push(CurrentNode);
    }

    return Path;
  }
}

export default Pathfinder;