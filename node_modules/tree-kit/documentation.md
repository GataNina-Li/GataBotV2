
# Tree Kit

This lib is a toolbox that provide functions to operate with nested `Object` structure.
It features the best `.extend()` method, providing dozen of options that all others libs miss.

* License: MIT
* Current status: release candidate
* Platform: Node.js only (browser support is planned)

Some tutorials are available at [blog.soulserv.net/tag/tree-kit](http://blog.soulserv.net/tag/tree-kit/).



# Install

Use Node Package Manager:

    npm install tree-kit



# Library references

* [.extend()](#ref.extend): full-featured extend facility, copy, clone, extend
* [.clone()](#ref.clone): clone any object
* [.diff()](#ref.diff): report differences between two objects



In all examples below, it is assumed that you have required the lib into the `tree` variable:
```js
var tree = require( 'tree-kit' ) ;
```



<a name="ref.extend"></a>
## .extend( options , target , source1 , [source2] , [...] )

* options `Object` extend options, it supports the properties:
	* own `boolean` only copy enumerable own properties from the sources
    * nonEnum `boolean` copy non-enumerable properties as well, works only with own:true
    * descriptor `boolean` preserve property's descriptor (i.e. writable, enumerable, configurable, get & set)
	* deep: `boolean` or `Array` or `Set`, if true perform a deep (recursive) extend, if it is an Array/Set of prototypes, only deep-copy
	  objects of those prototypes (it is a replacement for deepFilter.whitelist which was removed in Tree Kit 0.6)
	* immutables: an Array/Set of immutable object's prototypes that are filtered out for deep-copy (it is a replacement
	  for deepFilter.blacklist which was removed in Tree Kit 0.6)
	* circular `boolean` (default to false) if true then circular references are checked and each identical objects are reconnected
		(referenced), if false then nested object are blindly cloned
	* maxDepth `integer` used in conjunction with deep, when the max depth is reached an exception is raised, it defaults to 100
		when the 'circular' option is off, or defaults to null if 'circular' is on
	* move `boolean` move properties from the sources object to the target object (delete properties from the sources object)
	* preserve `boolean` existing properties in the target object will not be overwritten
	* nofunc `boolean` skip properties that are functions
	* deepFunc `boolean` in conjunction with 'deep', this will process sources functions like objects rather than
	  copying/referencing them directly into the source (default behaviour), thus, the result will not be a function,
	  it forces 'deep' options
	* proto `boolean` alter the target's prototype so that it matches the source's prototype.
	  It forces option 'own'. Specifying multiple sources does not make sens here.
	* inherit `boolean` make the target inherit from the source (the target's prototype will be the source itself, not its prototype).
	  It forces option 'own' and disable 'proto'. Specifying multiple sources does not make sens here.
	* skipRoot `boolean` prevent the prototype of the target **root** object from mutation.
	  Only nested objects' prototype will be mutated.
	* flat `boolean|string` sources properties are copied in a way to produce a *flat* target, the target's key
	  is the full path (separated by '.') of the source's key, also if a string is provided it will be used as
	  the path separator
	* unflat `boolean|string` it is the opposite of 'flat': assuming that the sources are in the *flat* format,
	  it expands all flat properties -- whose name are path with '.' as the separator -- deeply into the target, 
	  also if a string is provided it will be used as the path separator
* target `Object` the target of the extend, properties will be copied to this object
* source1 `Object` the source of the extend, properties will be copied from this object
* ...

This is a full-featured *extend* of an object with one or more source object.

It is easily translated from jQuery-like *extend()*:
* `extend( target , source )` translate into `tree.extend( null , target , source )`
* `extend( true , target , source )` translate into `tree.extend( { deep: true } , target , source )`

However, here we have full control over what will be extended and how.

**All the options above are inactive by default**.
You can pass null as argument #0 to get the default behaviour (= all options are inactive).
So using the default behaviour, `tree.extend()` will copy all enumerable properties, and perform a shallow copy (a nested object
is not cloned, it remains a reference of the original one).

With the *deep* option, a deep copy is performed, so nested object are cloned too.

The *own* option clone only owned properties from the sources, properties that are part of the source's prototype would not
be copied/cloned.

The *nonEnum* option will clone properties that are not enumerable.

The *descriptor* option will preserve property's descriptor, e.g. if the source property is not writable and not enumerable,
so will be the copied property.

In case of a *getter* properties:

* without the *descriptor* option, the getter function of the source object will be called, the return value will be put
  into the target property (so it lose its getter/setter behaviour)
* with the *descriptor* option, the getter & setter function of the source object will be copied (but not called) into the target
  property: the getter/setter behaviour is preserved

If *circular* is on, the lib will detect when the source's data structure reuses the same object multiple time and will preserve it.
We can see this *circular* feature in action in [this example](#example.circular).

Mixing *inherit* and *deep* provides a nice multi-level inheritance.

With the *flat* option example:
```js
var o = {
	one: 1,
	sub: {
		two: 2,
		three: 3
	}
} ;

var flatCopy = tree.extend( { flat: true } , {} , o ) ;
```
... it will produce:
```js
{
	one: 1,
	"sub.two": 2,
	"sub.three": 3
}
```

By the way, the *unflat* option does the opposite, and thus can reverse this back to the original form.

The *deepFilter* option is used when you do not want to clone some type of object.
Let's say you want a deep copy except for `Buffer` objects, you simply want them to share the same reference:
```js
var o = {
	one: '1' ,
	buf: new Buffer( "My buffer" ) ,
	subtree: {
		two: 2 ,
		three: 'THREE'
	}
} ;

// either
var extended1 = tree.extend( { deep: true, deepFilter: { whitelist: [ Object.prototype ] } } , {} , o ) ;
// or
var extended2 = tree.extend( { deep: true, deepFilter: { blacklist: [ Buffer.prototype ] } } , {} , o ) ;
```

Doing this, we have `o.buf === extended1.buf === extended2.buf`, and `o.subtree !== extended1.subtree !== extended2.subtree`.



<a name="ref.clone"></a>
## .clone( original , [circular] )

* original `Object` the source object to clone
* circular `boolean` (default to false) if true then circular references are checked and each identical objects are reconnected
	(referenced), if false then nested object are blindly cloned

It returns a clone of the *original* object, providing the best object-cloning facility that this lib can offer.

The clone produced are perfect independant copy **in 99% of use case**, but there is one big limitation:
method that access variables in the parent's scope.

The clone will share those variables with the *original* object, so they are not totally independant entity.
Design pattern using closure to emulate *private member* (e.g. the revealing pattern) can cause trouble.

If *circular* is on, the lib will detect when the source's data structure reuses the same object multiple time and will preserve it.

<a name="example.circular"></a>
Here is an example of this *circular* feature:
```js
var o = {
	a: 'a',
	sub: {
		b: 'b'
	},
	sub2: {
		c: 'c'
	}
} ;

o.loop = o ;
o.sub.loop = o ;
o.subcopy = o.sub ;
o.sub.link = o.sub2 ;
o.sub2.link = o.sub ;

var c = tree.clone( o , true ) ;

expect( c.loop ).to.be( c ) ;
expect( c.sub ).to.be( c.subcopy ) ;
expect( c.sub.loop ).to.be( c ) ;
expect( c.subcopy.loop ).to.be( c ) ;
expect( c.sub.link ).to.be( c.sub2 ) ;
expect( c.sub2.link ).to.be( c.sub ) ;
```

... without *circular* on, the `clone()` method would run forever, creating a new object independant nested object each time
it reaches the *loop* property.
We can see that the *subcopy* property remains a reference of *sub* even in the clone, thanks to the *circular* option.

However, if we are sure that there isn't multiple reference to the same object or circular references, we can gain a lot of
performances by leaving that options off.
It can save a lot of `.indexOf()` call on big data structure.

This method does not uses `extend()` anymore like in version 0.3.x, it now uses its own optimized code.
However it is equivalent to an `extend()` with those options turned on: *deep, own, nonEnum, descriptor & proto*.
If *circular* is on, it has the same effect than the `extend()`'s *circular* option.

**Also please note that design pattern emulating private members using a closure's scope cannot be truly cloned**
(e.g. the *revealing pattern*).
This is not possible to mutate a function's scope.
So the clone's methods will continue to inherit the parent's scope of the original function.



<a name="ref.diff"></a>
## .diff( left , right , [options] )

* left `Object` the left-hand side object structure
* right `Object` the right-hand side object structure
* options `Object` containing options, it supports:
	* path `string` the initial path, default: empty string
	* pathSeparator `string` the path separator, default: '.'

This tool reports diff between a left-hand side and right-hand side object structure.
It returns an object, each key is a path where a difference is reported, the value being an object containing (again) the path
and a human-readable message.

See this example:
```js
var left = {
	a: 'a',
	b: 2,
	c: 'three',
	sub: {
		e: 5,
		f: 'six',
	}
} ;

var right = {
	b: 2,
	c: 3,
	d: 'dee',
	sub: {
		e: 5,
		f: 6,
	}
} ;

console.log( tree.diff( a , b ) ) ;
```
It will output:
```js
{ '.a': { path: '.a', message: 'does not exist in right-hand side' },
  '.c': { path: '.c', message: 'different typeof: string - number' },
  '.sub.f': { path: '.sub.f', message: 'different typeof: string - number' },
  '.d': { path: '.d', message: 'does not exist in left-hand side' } }
```

