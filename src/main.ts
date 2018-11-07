
interface Position
{
  GetHuristicDistance(to:Position): number;
  GetAdjacent(): Array<Position>;
}

export abstract class Pathfinder
{
  FindPath(from:Position, to:Position): Array<Position>
  {
    let UnexploredNodes:Array<Position> = new Array<Position>(from);
    let ExpoloredNodes:Array<[Position,Position]> = new Array<[Position,Position]>();

    do {
      
    } while (true);
  }
}

export default Pathfinder;