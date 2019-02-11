
export interface IPosition
{
  GetHeuristicDistance(to:IPosition): number;
  GetAdjacent(): Array<IPosition>;
  Equals(other:IPosition): boolean;
  toString(): string;

  Intersection(line1:[IPosition,IPosition],line2:[IPosition,IPosition]): boolean;
}
