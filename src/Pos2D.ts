import { IPosition } from './PathFinder';

export class Pos2D implements IPosition
{
    constructor( readonly x:number, readonly y:number, readonly maxX:number, readonly maxY:number ) {}

    GetHuristicDistance(to:Pos2D): number
    {
        return Math.sqrt( (this.x - to.x) ** 2 + (this.y - to.y) ** 2 );
    }

    GetAdjacent(): Array<IPosition>
    {
        var adj = new Array();

        if (this.x - 1 >= 0)
        {
            if (this.y - 1 >= 0)
                adj.push(new Pos2D(this.x - 1, this.y - 1, this.maxX, this.maxY));

            adj.push(new Pos2D(this.x - 1, this.y, this.maxX, this.maxY));

            if (this.y + 1 <= this.maxY)
                adj.push(new Pos2D(this.x - 1, this.y + 1, this.maxX, this.maxY));
        }

        if (this.y - 1 >= 0)
            adj.push(new Pos2D(this.x, this.y - 1, this.maxX, this.maxY));

        if (this.y + 1 <= this.maxY)
            adj.push(new Pos2D(this.x, this.y + 1, this.maxX, this.maxY));

        if (this.x + 1 <= this.maxX)
        {
            if (this.y - 1 >= 0)
                adj.push(new Pos2D(this.x + 1, this.y - 1, this.maxX, this.maxY));

            adj.push(new Pos2D(this.x + 1, this.y, this.maxX, this.maxY));

            if (this.y + 1 <= this.maxY)
                adj.push(new Pos2D(this.x + 1, this.y + 1, this.maxX, this.maxY));
        }

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