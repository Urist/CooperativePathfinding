
export class PriorityQueue<T>
{
    private _data:(T)[];
    private _elements:number;
    private _comparator:(a:T,b:T) => boolean;

    constructor (comparator = (a:T, b:T) => a >= b)
    {
        this._data = [];
        this._elements = 0;
        this._comparator = comparator;
    }

    get length():number
    {
        return this._elements;
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
                break;
            }
        }

        // Add the new item
        this._data[newPosition] = newElement;

        // Heapify up
        var parentPos = this._parent(newPosition);
        var currentPos = newPosition;
        while (parentPos !== undefined)
        {
            if (!this._comparator(this._data[parentPos], this._data[currentPos]))
            {
                this._sawp(parentPos, currentPos);
            }
            else
            {
                break;
            }
            currentPos = parentPos;
            parentPos = this._parent(currentPos);
        }
        this._elements++;
    }

    Remove ():T
    {
        if(this._data.length === 0)
        {
            throw "Remove called on empty queue";
        }

        var returnElement = this._data[0];
        delete this._data[0];
        var pos = 0;

        // Heapify down
        while (true)
        {
            var lv = this._leftVal(pos);
            var rv = this._rightVal(pos);
            var lp = this._left(pos);
            var rp = this._right(pos);

            if (rv === undefined && lv === undefined)
            {
                // No children, nothing to do
                break;
            }
            else if (rv !== undefined && lv === undefined)
            {
                // Right exists, move it up and check for children
                this._sawp(pos, rp);
                pos = rp;
            }
            else if (rv === undefined && lv !== undefined)
            {
                // Left exists, move it up and check for children
                this._sawp(pos, lp);
                pos = lp;
            }
            else 
            {
                // Left and right both exist, choose one to move up then check it's children
                if (!this._comparator(lv, rv))
                {
                    this._sawp(pos, rp);
                    pos = rp;
                }
                else
                {
                    this._sawp(pos, lp);
                    pos = lp;
                }
            }
        }
        this._elements--;
        return returnElement;
    }

    // Helpers
    private _parent (position:number):number|undefined
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

    private _val (position:number):T { return this._data[position]; }

    private _left (position:number):number { return 2 * position + 1; }

    private _leftVal (position:number):T { return this._data[this._left(position)]; }

    private _right (position:number):number { return 2 * position + 2; }

    private _rightVal (position:number):T { return this._data[this._right(position)]; }

    private _sawp (p1:number, p2:number):void
    {
        // Use array destructuring to swap the two elements
        [this._data[p1],this._data[p2]] = [this._data[p2],this._data[p1]];
    }
}
