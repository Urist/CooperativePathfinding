
export class PriorityQueue<T>
{
    _data:T[];
    _comparator:(a:T,b:T) => boolean;

    constructor (comparator = (a:T, b:T) => a > b)
    {
        this._data = [];
        this._comparator = comparator;
    }

    Insert (newElement:T)
    {
        // Default to a new position, we be updated if an empty spoty is found
        let newPosition:number = this._data.length;
        
        // Find a spot
        for (var pos = 0; pos < this._data.length; pos++)
        {
            if (this._data[pos] == null) // checks null and undefined :)
            {
                this._data[pos] = newElement;
                newPosition = pos;
            }
        }

        // Heapify up
        var parentPos = this._parent(newPosition);
        while (parentPos)
        {
            if (this._comparator(this._data[parentPos], this._data[newPosition]))
            {
                var tmp = this._data[parentPos];
                this._data[newPosition] = this._data[parentPos];
                this._data[parentPos] = tmp;
            }
            else
            {
                break;
            }
            parentPos = this._parent(newPosition);
        }
    }

    Remove ():T
    {
        var returnElement = this._data[0];

        // Heapify down
        while (true)
        {
            var pos = 0;

            if (!this._leftVal(pos))
            {
                // Right might exist, move it up and we're done
                this._data[pos] = this._rightVal(pos);
                break;
            }

            if (!this._rightVal(pos))
            {
                // Left might exists, move it up and we're done
                this._data[pos] = this._leftVal(pos);
                break;
            }

            // Left and right both exist, choose one to move up then check it's children
            if (this._comparator(this._leftVal(pos), this._rightVal(pos)))
            {
                this._data[pos] = this._rightVal(pos);
                pos = this._right(pos);
            }
            else
            {
                this._data[pos] = this._leftVal(pos);
                pos = this._left(pos);
            }
        }

        return returnElement;
    }

    // Helpers
    _parent (position:number):number|undefined
    {
        if (position === 0) { return undefined; }

        switch (position % 2)
        {
        case 0:
            return (position - 2) / 2;
        case 1:
            return (position - 1) / 2;
        }
    }

    _val (position:number):T { return this._data[position]; }

    _left (position:number):number { return 2 * position + 1; }

    _leftVal (position:number):T { return this._data[this._left(position)]; }

    _right (position:number):number { return 2 * position + 2; }

    _rightVal (position:number):T { return this._data[this._right(position)]; }
}
