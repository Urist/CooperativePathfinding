import { Dictionary } from 'typescript-collections';
/**
 * Maps both values for each key to the given function and returns an array of the results. Both Dictionaries ar expected to have the same set of keys.
 * @param a Dictionary A
 * @param b Dictionary B which must have the same type and keys as Dictionary A
 * @param fn Each key and the two values it maps to are passed to this function
 */
export function DictionaryMap2ToArray<KeyType, ValueType, ResultType>(
    a:Dictionary<KeyType, ValueType>, 
    b:Dictionary<KeyType, ValueType>,
    fn:(key:KeyType, valueA:ValueType|undefined, valueB:ValueType|undefined)=>ResultType
    ):ResultType[]
{
    if (a.size !== b.size)
        throw new Error('Dictionary sizes do not match');

    let result:ResultType[] = new Array<ResultType>();
    
    a.forEach(
        (k, av) =>
        {
            var bv = b.getValue(k);
            if (bv === undefined)
                throw new Error('Dictionary keys do not match');
            result.push( fn(k, av, bv) );
        }
    );

    return result;
}
