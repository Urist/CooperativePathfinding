import { Dictionary } from 'typescript-collections';

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