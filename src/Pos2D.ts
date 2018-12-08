import { IPosition } from './PathFinder';

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
  
}