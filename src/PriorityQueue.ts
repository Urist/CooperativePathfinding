
export class PriorityQueue<T>
{
    private _data:(T)[];
    private _elements:number;
    private _comparator:(a:T,b:T) => number;

    private _freelist:number[];

    constructor (comparator:(a:T, b:T) => number)
    {
        this._data = [];
        this._elements = 0;
        this._comparator = comparator;
        this._freelist = [];
    }

    get length():number
    {
        return this._elements;
    }

    Insert (newElement:T)
    {
        let newPosition:number;

        // Try to get the most recently opened slot
        let freePos:number|undefined = this._freelist.pop();
        // If the freelist didn't know about any open slots, then create a new slot at the end
        // Note: I was tempted to use "freePos || _data.length", however that fails because
        // the freelist can return 0 as an open slot which is a falsy value and thus does not get used
        if (freePos !== undefined) {
            newPosition = freePos;
        } else {
            newPosition = this._data.length;
        }

        // Add the new item
        this._data[newPosition] = newElement;

        this._heapifyUp(newPosition);
        this._heapifyDown(0);

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

        pos = this._heapifyDown(0);

        this._freelist.push(pos);
        this._elements--;
        return returnElement;
    }

    private _heapifyUp(start:number) {
        var parentPos = this._parent(start);
        var currentPos = start;
        while (parentPos !== undefined)
        {
            if (this._comparator(this._data[parentPos], this._data[currentPos]) < 0 )
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
    }

    private _heapifyDown (start:number):number {
        var pos = start;
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
                // Right exists, should it be moved up?
                if (this._val(pos) == null || this._val(pos) < rv)
                {
                    // Move it up and check for children
                    this._sawp(pos, rp);
                    pos = rp;
                }
                else
                {
                    // If not, we're done!
                    break;
                }
            }
            else if (rv === undefined && lv !== undefined)
            {
                // Left exists, should it be moved up?
                if (this._val(pos) == null || this._val(pos) < lv)
                {
                    // Move it up and check for children
                    this._sawp(pos, lp);
                    pos = lp;
                }
                else
                {
                    // If not, we're done!
                    break;
                }
            }
            else 
            {
                // Left and right both exist, choose one to move up then check it's children
                if (this._comparator(lv, rv) )
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
        return pos;
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
