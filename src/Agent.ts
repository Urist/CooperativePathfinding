import { IPosition } from './IPosition';

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

  idEquals(other:Agent): boolean
  {
    if (this.id === other.id)
    {
      if (this.destination.Equals(other.destination) === false)
      {
        throw new Error('Encountered Agents with same id but different destinations');
      }
      return true;
    }
    return false;
  }
  deepEquals(other:Agent): boolean
  {
    if (this.id === other.id)
    {
      if (this.destination.Equals(other.destination) === false)
      {
        throw new Error('Encountered Agents with same id but different destinations');
      }
      else
      {
        return this.location.Equals(other.location);
      }
    }
    return false;
  }

  /**
   * toString method using only Agent ID, used so that the same agent in a different position gets mapped to the same key in the Dictionary type. Use verboseToString to get all fields.
   */
  toString():string
  {
    return `Agent${this.id}`;
  }

  verboseToString():string
  {
    return `{${this.id}, ${this.location}, ${this.destination}}`;
  }
}
