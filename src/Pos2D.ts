import { IPosition } from './IPosition';

export class Map
{
    constructor( readonly m:boolean[][] ) {}
}

export class Pos2D implements IPosition
{
    constructor( readonly x:number, readonly y:number, readonly map:Map ) {}

    GetHeuristicDistance(to:Pos2D): number
    {
        return Math.sqrt( (this.x - to.x) ** 2 + (this.y - to.y) ** 2 );
    }

    GetAdjacent(): Array<IPosition>
    {
        var adj = new Array();

        // Don't bother bounds checking at first, the filter below will remove invalid entries
        adj.push(new Pos2D(this.x - 1, this.y - 1, this.map));
        adj.push(new Pos2D(this.x - 1, this.y, this.map));
        adj.push(new Pos2D(this.x - 1, this.y + 1, this.map));
        adj.push(new Pos2D(this.x, this.y - 1, this.map));
        adj.push(new Pos2D(this.x, this.y, this.map));
        adj.push(new Pos2D(this.x, this.y + 1, this.map));
        adj.push(new Pos2D(this.x + 1, this.y - 1, this.map));
        adj.push(new Pos2D(this.x + 1, this.y, this.map));
        adj.push(new Pos2D(this.x + 1, this.y + 1, this.map));

        // Remove entries that are blocked or outside the bounds
        adj = adj.filter( (p:Pos2D) => this.map.m[p.x] && this.map.m[p.x][p.y] );

        return adj;

    }

    Equals(other:Pos2D): boolean
    {
        return this.x === other.x && this.y === other.y;
    }

    toString(): string
    {
        return `(${this.x},${this.y})`;
    }

    Intersection(line1:[Pos2D,Pos2D],line2:[Pos2D,Pos2D]): boolean
    {
        // Swapping positions and diagonal crossings are not allowed
        // This is checked by the following:
        // Aligned in X at start and end, and passed each other in X.
        // OR
        // Aligned in Y at start and end, and passed each other in Y.
        var tstart = line1[0]; // TestAgent Start Position
        var tend = line1[1]; // TestAgent End Position
        var ostart = line2[0]; // OtherAgent Start Position
        var oend = line2[1]; // OtherAgent End Position
        return (
          (
            // Aligned in X at start and end,
            tstart.x === ostart.x && tend.x === oend.x &&
            // and Passed each other in X
            tend.x === ostart.x && oend.x === tstart.x
          )
          || // OR
          (
            // Aligned in Y at start and end,
            tstart.y === ostart.y && tend.y === oend.y &&
            // and Passed each other in Y
            tend.y === ostart.y && oend.y === tstart.y
          ));
    } 
}