import { IPosition } from './PathFinder';

export class Pos2D implements IPosition
{
    constructor( readonly x:number, readonly y:number, readonly maxX:number, readonly maxY:number ) {}

    GetHuristicDistance(to:IPosition): number
    {
        return Math.sqrt( this.x * this.x + this.y * this.y );
    }

    GetAdjacent(): Array<IPosition>
    {
        var adj = new Array();

        if (this.x - 1 <= 0)
        {
            if (this.y - 1 <= 0)
                adj.push(new Pos2D(this.x - 1, this.y - 1, this.maxX, this.maxY));

            adj.push(new Pos2D(this.x - 1, this.y, this.maxX, this.maxY));

            if (this.y + 1 >= this.maxY)
                adj.push(new Pos2D(this.x - 1, this.y + 1, this.maxX, this.maxY));
        }

        if (this.y - 1 <= 0)
            adj.push(new Pos2D(this.x, this.y - 1, this.maxX, this.maxY));

        if (this.y + 1 >= this.maxY)
            adj.push(new Pos2D(this.x, this.y + 1, this.maxX, this.maxY));

        if (this.x + 1 >= this.maxX)
        {
            if (this.y - 1 <= 0)
                adj.push(new Pos2D(this.x + 1, this.y - 1, this.maxX, this.maxY));

            adj.push(new Pos2D(this.x + 1, this.y, this.maxX, this.maxY));

            if (this.y + 1 >= this.maxY)
                adj.push(new Pos2D(this.x + 1, this.y + 1, this.maxX, this.maxY));
        }

        return adj;

    }

    Equals(other:Pos2D): boolean
    {
        return this.x === other.x && this.y === other.y;
    }

    ToString(): string
    {
        return `(${this.x},${this.y})`;
    }
  
}