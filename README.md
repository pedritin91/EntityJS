# JStore: dynamical persistent object.
There's a lot of ways to persist data in browser, but no one with dynamically access with chained-object syntax, the further I know. Initially is created to persist data in browser with `localStorage` and built with **Javascript Proxy's API** for dynamical access for stored values.

## Usage
### Important:
* Always use **$** prefix for stop reading/writing with chaining-syntax:

`JStore.storageKey.objectName.$readableKey`

* Any attempt to read a key returns the existing value or `undefined`

**Root-key reading/writing**
```javascript
let value = JStore.$sampleKey;
//value = undefined

JStore.$sampleKey = { a: { nested: { key: "for read/write"} } };

//We are sure we've created this key, so $ symbol is in $sampleKey which returns the stored object with his native key-reading.
value = JStore.$sampleKey.a.nested.key; 
//returns "for read/write"

//Note that $ symbol is now at the last key
value = JStore.sampleKey.a.nested.$key; //returns "for read/write"
```

**Infinite deep reading/writing**
```javascript
let aVeryNestedValue = JStore.sampleHashKey['a']['very']['nested']['key']['even']['a']['nonExisting'].$key; 

let toWrite = JStore.sampleHashKey;
for(var key of ['a','very','nested','key','even','a','nonExisting'])
  toWrite = toWrite[key];
toWrite.$value = "the final value"
```

**Dynamical reading/writing**
```javascript
let dynamicalKeyedValue = JStore.sampleHashKey.['$' + aPrefixVar + '_key_' + aPostfixVar]; 
//returns unefined
JStore.sampleHashKey.['$' + aPrefixVar + '_key_' + aPostfixVar] = "a value"; 
//stores the value at specified path
dynamicalKeyedValue = JStore.sampleHashKey.['$' + aPrefixVar + '_key_' + aPostfixVar];
//returns "a value"
```

**With no stop specification (with '$' as key's prefix-symbol) will return the Proxy asociated to the current path for further operations.**
