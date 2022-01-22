# TOC
   - [Basic synchronous event-emitting (node-compatible)](#basic-synchronous-event-emitting-node-compatible)
   - [Basic synchronous event-emitting (NOT compatible with node)](#basic-synchronous-event-emitting-not-compatible-with-node)
   - [Next Gen feature: async emitting](#next-gen-feature-async-emitting)
   - [Next Gen feature: contexts](#next-gen-feature-contexts)
   - [Next Gen feature: contexts queue](#next-gen-feature-contexts-queue)
   - [Next Gen feature: contexts serialization](#next-gen-feature-contexts-serialization)
<a name=""></a>
 
<a name="basic-synchronous-event-emitting-node-compatible"></a>
# Basic synchronous event-emitting (node-compatible)
should add one listener and emit should trigger it, using 'new'.

```js
var bus = new NextGenEvents() ;

var triggered = 0 ;

bus.on( 'hello' , function() { triggered ++ ; } ) ;

bus.emit( 'hello' ) ;

expect( triggered ).to.be( 1 ) ;
```

should add one listener and emit should trigger it, using 'Object.create()'.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var triggered = 0 ;

bus.on( 'hello' , function() { triggered ++ ; } ) ;

bus.emit( 'hello' ) ;

expect( triggered ).to.be( 1 ) ;
```

should emit with argument.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var triggered = 0 ;

bus.on( 'hello' , function( arg1 , arg2 ) {
	triggered ++ ;
	expect( arg1 ).to.be( 'world' ) ;
	expect( arg2 ).to.be( '!' ) ;
} ) ;

bus.emit( 'hello' , 'world' , '!' ) ;

expect( triggered ).to.be( 1 ) ;
```

should add many basic listeners for many events, and multiple emits should trigger only relevant listener.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
var triggered = { foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ;

// 1 listener for 'foo'
bus.on( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; } ) ;

// 2 listeners for 'bar'
bus.on( 'bar' , onBar1 = function() { triggered.bar1 ++ ; } ) ;
bus.on( 'bar' , onBar2 = function() { triggered.bar2 ++ ; } ) ;

// 3 listeners for 'baz'
bus.on( 'baz' , onBaz1 = function() { triggered.baz1 ++ ; } ) ;
bus.on( 'baz' , onBaz2 = function() { triggered.baz2 ++ ; } ) ;
bus.on( 'baz' , onBaz3 = function() { triggered.baz3 ++ ; } ) ;

bus.emit( 'foo' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;

bus.emit( 'bar' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;

bus.emit( 'baz' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;

bus.emit( 'qux' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;

bus.emit( 'foo' ) ;
bus.emit( 'foo' ) ;
expect( triggered ).to.eql( { foo1: 3 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;

bus.emit( 'qux' ) ;
bus.emit( 'qux' ) ;
expect( triggered ).to.eql( { foo1: 3 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;

bus.emit( 'baz' ) ;
bus.emit( 'baz' ) ;
expect( triggered ).to.eql( { foo1: 3 , bar1: 1 , bar2: 1 , baz1: 3 , baz2: 3 , baz3: 3 , qux: 0 } ) ;
```

should add and remove listeners.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
var triggered = { foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ;

// 1 listener for 'foo'
bus.on( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; } ) ;

// 2 listeners for 'bar'
bus.on( 'bar' , onBar1 = function() { triggered.bar1 ++ ; } ) ;
bus.on( 'bar' , onBar2 = function() { triggered.bar2 ++ ; } ) ;

// 3 listeners for 'baz'
bus.on( 'baz' , onBaz1 = function() { triggered.baz1 ++ ; } ) ;
bus.on( 'baz' , onBaz2 = function() { triggered.baz2 ++ ; } ) ;
bus.on( 'baz' , onBaz3 = function() { triggered.baz3 ++ ; } ) ;

bus.emit( 'foo' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;

bus.emit( 'bar' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;

bus.removeListener( 'bar' , onBar2 ) ;
bus.emit( 'bar' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 2 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;

bus.removeListener( 'bar' , onBar2 ) ;
bus.emit( 'bar' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 3 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;

bus.removeListener( 'foo' , onBar1 ) ; // Not listening for this event!
bus.removeListener( 'bar' , function() {} ) ; // Not event registered
bus.emit( 'foo' ) ;
bus.emit( 'bar' ) ;
expect( triggered ).to.eql( { foo1: 2 , bar1: 4 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;
```

.removeAllListeners() should remove all listeners for an event.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
var triggered = { foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ;

// 1 listener for 'foo'
bus.on( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; } ) ;

// 2 listeners for 'bar'
bus.on( 'bar' , onBar1 = function() { triggered.bar1 ++ ; } ) ;
bus.on( 'bar' , onBar2 = function() { triggered.bar2 ++ ; } ) ;

// 3 listeners for 'baz'
bus.on( 'baz' , onBaz1 = function() { triggered.baz1 ++ ; } ) ;
bus.on( 'baz' , onBaz2 = function() { triggered.baz2 ++ ; } ) ;
bus.on( 'baz' , onBaz3 = function() { triggered.baz3 ++ ; } ) ;

bus.emit( 'foo' ) ;
bus.emit( 'bar' ) ;
bus.emit( 'baz' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;

bus.removeAllListeners( 'bar' ) ;
bus.emit( 'bar' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;

bus.emit( 'foo' ) ;
expect( triggered ).to.eql( { foo1: 2 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;

bus.removeAllListeners( 'baz' ) ;
bus.emit( 'foo' ) ;
bus.emit( 'bar' ) ;
bus.emit( 'baz' ) ;
expect( triggered ).to.eql( { foo1: 3 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;
```

.removeAllListeners() without argument should all listeners for all events.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
var triggered = { foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ;

// 1 listener for 'foo'
bus.on( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; } ) ;

// 2 listeners for 'bar'
bus.on( 'bar' , onBar1 = function() { triggered.bar1 ++ ; } ) ;
bus.on( 'bar' , onBar2 = function() { triggered.bar2 ++ ; } ) ;

// 3 listeners for 'baz'
bus.on( 'baz' , onBaz1 = function() { triggered.baz1 ++ ; } ) ;
bus.on( 'baz' , onBaz2 = function() { triggered.baz2 ++ ; } ) ;
bus.on( 'baz' , onBaz3 = function() { triggered.baz3 ++ ; } ) ;

bus.emit( 'foo' ) ;
bus.emit( 'bar' ) ;
bus.emit( 'baz' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;

bus.removeAllListeners() ;
bus.emit( 'foo' ) ;
bus.emit( 'bar' ) ;
bus.emit( 'baz' ) ;
bus.emit( 'qux' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;
```

.once() should add one time listener for an event, the event should stop listening after being triggered once.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
var triggered = { foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , qux: 0 } ;

// 1 listener for 'foo'
bus.once( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; } ) ;

// 2 listeners for 'bar'
bus.on( 'bar' , onBar1 = function() { triggered.bar1 ++ ; } ) ;
bus.once( 'bar' , onBar2 = function() { triggered.bar2 ++ ; } ) ;

// 3 listeners for 'baz'
bus.on( 'baz' , onBaz1 = function() { triggered.baz1 ++ ; } ) ;
onBaz2 = function() { triggered.baz2 ++ ; } ;
bus.once( 'baz' , onBaz2 ) ;
bus.once( 'baz' , onBaz2 ) ;
bus.once( 'baz' , onBaz2 ) ;

bus.emit( 'foo' ) ;
bus.emit( 'bar' ) ;
bus.emit( 'baz' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 3 , qux: 0 } ) ;

bus.emit( 'foo' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 3 , qux: 0 } ) ;

bus.emit( 'bar' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 2 , bar2: 1 , baz1: 1 , baz2: 3 , qux: 0 } ) ;

bus.emit( 'baz' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 2 , bar2: 1 , baz1: 2 , baz2: 3 , qux: 0 } ) ;
```

unhandled 'error' event should throw whatever is passed to it.

```js
var throwed = 0 , triggered = 0 ;
var bus = Object.create( NextGenEvents.prototype ) ;
var testError = new Error( 'Some error occurs!' ) ;

var onError = function( error ) {
	triggered ++ ;
	expect( error ).to.be( testError ) ;
} ;

try {
	bus.emit( 'error' , testError ) ;
}
catch ( error ) {
	throwed ++ ;
	expect( error ).to.be( testError ) ;
}

expect( throwed ).to.be( 1 ) ;

bus.once( 'error' , onError ) ;

bus.emit( 'error' , testError ) ;
// Should not throw
expect( triggered ).to.be( 1 ) ;

try {
	bus.emit( 'error' , testError ) ;
}
catch ( error ) {
	throwed ++ ;
	expect( error ).to.be( testError ) ;
}

expect( throwed ).to.be( 2 ) ;
```

NextGenEvents.listenerCount() should count listeners for an event.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var onFoo1 ;

onFoo1 = function() {} ;

bus.on( 'foo' , onFoo1 ) ;
expect( NextGenEvents.listenerCount( bus , 'foo' ) ).to.be( 1 ) ;
expect( NextGenEvents.listenerCount( bus , 'bar' ) ).to.be( 0 ) ;

bus.on( 'foo' , onFoo1 ) ;
bus.on( 'foo' , onFoo1 ) ;

expect( NextGenEvents.listenerCount( bus , 'foo' ) ).to.be( 3 ) ;
expect( NextGenEvents.listenerCount( bus , 'bar' ) ).to.be( 0 ) ;

bus.removeListener( 'foo' , onFoo1 ) ;

expect( NextGenEvents.listenerCount( bus , 'foo' ) ).to.be( 0 ) ;
expect( NextGenEvents.listenerCount( bus , 'bar' ) ).to.be( 0 ) ;

bus.once( 'foo' , onFoo1 ) ;
expect( NextGenEvents.listenerCount( bus , 'foo' ) ).to.be( 1 ) ;
expect( NextGenEvents.listenerCount( bus , 'bar' ) ).to.be( 0 ) ;

bus.emit( 'foo' ) ;
expect( NextGenEvents.listenerCount( bus , 'foo' ) ).to.be( 0 ) ;
expect( NextGenEvents.listenerCount( bus , 'bar' ) ).to.be( 0 ) ;
```

<a name="basic-synchronous-event-emitting-not-compatible-with-node"></a>
# Basic synchronous event-emitting (NOT compatible with node)
should remove every occurences of a listener for one event.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var onFoo1 , onBar1 , onBar2 ;
var triggered = { foo1: 0 , bar1: 0 , bar2: 0 } ;

onFoo1 = function() { triggered.foo1 ++ ; } ;
onBar1 = function() { triggered.bar1 ++ ; } ;
onBar2 = function() { triggered.bar2 ++ ; } ;

// 1 listener for 'foo'
bus.on( 'foo' , onFoo1 ) ;

// 2 listeners for 'bar'
bus.on( 'bar' , onBar1 ) ;

// Same listener added multiple times
bus.on( 'bar' , onBar2 ) ;
bus.on( 'bar' , onBar2 ) ;
bus.on( 'bar' , onBar2 ) ;

bus.emit( 'foo' ) ;
bus.emit( 'bar' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 3 } ) ;

bus.removeListener( 'bar' , onBar2 ) ;
bus.emit( 'bar' ) ;
expect( triggered ).to.eql( { foo1: 1 , bar1: 2 , bar2: 3 } ) ;
```

should emit 'newListener' every time a new listener is added, with an array of listener object.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var stats = { count: {} , orders: [] } ;


bus.on( 'newListener' , genericListener.bind( undefined , 'new1' , stats , function( listeners ) {
	
	expect( listeners.length ).to.be( 1 ) ;
	expect( typeof listeners[ 0 ] ).to.be( 'object' ) ;
	
	switch ( stats.count.new1 )
	{
		case 1 :
			expect( listeners[ 0 ].event ).to.be( 'foo' ) ;
			break ;
		case 2 :
			expect( listeners[ 0 ].event ).to.be( 'newListener' ) ;
			break ;
		case 3 :
			expect( listeners[ 0 ].event ).to.be( 'bar' ) ;
			break ;
		default :
			expect().fail() ;
	}
} ) ) ;

expect( stats.count ).to.eql( {} ) ;


bus.on( 'foo' , genericListener.bind( undefined , 'foo' , stats , undefined ) ) ;
expect( stats.count ).to.eql( { new1: 1 } ) ;
expect( stats.orders ).to.eql( [ 'new1' ] ) ;

bus.emit( 'foo' ) ;
expect( stats.count ).to.eql( { new1: 1 , foo: 1 } ) ;
expect( stats.orders ).to.eql( [ 'new1' , 'foo' ] ) ;


bus.on( 'newListener' , genericListener.bind( undefined , 'new2' , stats , function( listeners ) {
	
	expect( listeners.length ).to.be( 1 ) ;
	expect( typeof listeners[ 0 ] ).to.be( 'object' ) ;
	
	switch ( stats.count.new2 )
	{
		case 1 :
			expect( listeners[ 0 ].event ).to.be( 'bar' ) ;
			break ;
		default :
			expect().fail() ;
	}
} ) ) ;

expect( stats.count ).to.eql( { new1: 2 , foo: 1 } ) ;
expect( stats.orders ).to.eql( [ 'new1' , 'foo' , 'new1' ] ) ;


bus.once( 'bar' , genericListener.bind( undefined , 'bar' , stats , undefined ) ) ;
expect( stats.count ).to.eql( { new1: 3 , new2: 1 , foo: 1 } ) ;
expect( stats.orders ).to.eql( [ 'new1' , 'foo' , 'new1' , 'new1' , 'new2' ] ) ;

bus.emit( 'bar' ) ;
expect( stats.count ).to.eql( { new1: 3 , new2: 1 , foo: 1 , bar: 1 } ) ;
expect( stats.orders ).to.eql( [ 'new1' , 'foo' , 'new1' , 'new1' , 'new2' , 'bar' ] ) ;
```

should emit 'removeListener' every time a new listener is removed (one time listener count as well once triggered), with an array of listener object.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var stats = { count: {} , orders: [] } ;

var onFoo = genericListener.bind( undefined , 'foo' , stats , undefined ) ;
var onBar1 = genericListener.bind( undefined , 'bar1' , stats , undefined ) ;
var onBar2 = genericListener.bind( undefined , 'bar2' , stats , undefined ) ;


bus.on( 'removeListener' , genericListener.bind( undefined , 'rm1' , stats , function( listeners ) {
	
	switch ( stats.count.rm1 )
	{
		case 1 :
			expect( listeners.length ).to.be( 1 ) ;
			expect( typeof listeners[ 0 ] ).to.be( 'object' ) ;
			expect( listeners[ 0 ].event ).to.be( 'foo' ) ;
			expect( listeners[ 0 ].id ).to.be( onFoo ) ;
			break ;
		case 2 :
			expect( listeners.length ).to.be( 3 ) ;
			expect( typeof listeners[ 0 ] ).to.be( 'object' ) ;
			expect( typeof listeners[ 1 ] ).to.be( 'object' ) ;
			expect( typeof listeners[ 2 ] ).to.be( 'object' ) ;
			expect( listeners[ 0 ].event ).to.be( 'foo' ) ;
			expect( listeners[ 0 ].id ).to.be( onFoo ) ;
			expect( listeners[ 1 ].event ).to.be( 'foo' ) ;
			expect( listeners[ 1 ].id ).to.be( onFoo ) ;
			expect( listeners[ 2 ].event ).to.be( 'foo' ) ;
			expect( listeners[ 2 ].id ).to.be( onFoo ) ;
			break ;
		case 3 :
			expect( listeners.length ).to.be( 1 ) ;
			expect( typeof listeners[ 0 ] ).to.be( 'object' ) ;
			expect( listeners[ 0 ].event ).to.be( 'foo' ) ;
			expect( listeners[ 0 ].id ).to.be( onFoo ) ;
			break ;
		case 4 :
			expect( listeners.length ).to.be( 2 ) ;
			expect( typeof listeners[ 0 ] ).to.be( 'object' ) ;
			expect( typeof listeners[ 1 ] ).to.be( 'object' ) ;
			expect( listeners[ 0 ].event ).to.be( 'bar' ) ;
			expect( listeners[ 0 ].id ).to.be( onBar1 ) ;
			expect( listeners[ 1 ].event ).to.be( 'bar' ) ;
			expect( listeners[ 1 ].id ).to.be( onBar2 ) ;
			break ;
		default :
			expect().fail() ;
	}
} ) ) ;

expect( stats.count ).to.eql( {} ) ;


bus.on( 'foo' , onFoo ) ;
expect( stats.count ).to.eql( {} ) ;
expect( stats.orders ).to.eql( [] ) ;

bus.off( 'foo' , onFoo ) ;
expect( stats.count ).to.eql( { rm1: 1 } ) ;
expect( stats.orders ).to.eql( [ 'rm1' ] ) ;

bus.on( 'foo' , onFoo ) ;
bus.on( 'foo' , onFoo ) ;
bus.on( 'foo' , onFoo ) ;
expect( stats.count ).to.eql( { rm1: 1 } ) ;
expect( stats.orders ).to.eql( [ 'rm1' ] ) ;

bus.off( 'foo' , onFoo ) ;
expect( stats.count ).to.eql( { rm1: 2 } ) ;
expect( stats.orders ).to.eql( [ 'rm1' , 'rm1' ] ) ;

bus.once( 'foo' , onFoo ) ;
expect( stats.count ).to.eql( { rm1: 2 } ) ;
expect( stats.orders ).to.eql( [ 'rm1' , 'rm1' ] ) ;

bus.emit( 'foo' , onFoo ) ;
expect( stats.count ).to.eql( { rm1: 3 , foo: 1 } ) ;
expect( stats.orders ).to.eql( [ 'rm1' , 'rm1' , 'foo' , 'rm1' ] ) ;

bus.on( 'foo' , onFoo ) ;
bus.on( 'bar' , onBar1 ) ;
bus.on( 'bar' , onBar2 ) ;
bus.removeAllListeners( 'bar' ) ;

expect( stats.count ).to.eql( { rm1: 4 , foo: 1 } ) ;
expect( stats.orders ).to.eql( [ 'rm1' , 'rm1' , 'foo' , 'rm1' , 'rm1' ] ) ;

bus.on( 'foo' , onFoo ) ;
bus.on( 'bar' , onBar1 ) ;
bus.on( 'bar' , onBar2 ) ;
bus.removeAllListeners() ;

// 'removeListener' listener are not fired: they are already deleted
expect( stats.count ).to.eql( { rm1: 4 , foo: 1 } ) ;
expect( stats.orders ).to.eql( [ 'rm1' , 'rm1' , 'foo' , 'rm1' , 'rm1' ] ) ;
```

.listeners() should return all the listeners for an event.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var listeners , onFoo1 ;

onFoo1 = function() {} ;

bus.on( 'foo' , onFoo1 ) ;
listeners = bus.listeners( 'foo' ) ;
expect( listeners.length ).to.be( 1 ) ;
expect( listeners[ 0 ].id ).to.be( onFoo1 ) ;
expect( listeners[ 0 ].fn ).to.be( onFoo1 ) ;
expect( listeners[ 0 ].event ).to.be( 'foo' ) ;
expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;

bus.on( 'foo' , onFoo1 ) ;
bus.on( 'foo' , onFoo1 ) ;

listeners = bus.listeners( 'foo' ) ;
expect( listeners.length ).to.be( 3 ) ;
expect( listeners[ 1 ].id ).to.be( onFoo1 ) ;
expect( listeners[ 1 ].fn ).to.be( onFoo1 ) ;
expect( listeners[ 1 ].event ).to.be( 'foo' ) ;
expect( listeners[ 2 ].id ).to.be( onFoo1 ) ;
expect( listeners[ 2 ].fn ).to.be( onFoo1 ) ;
expect( listeners[ 2 ].event ).to.be( 'foo' ) ;
expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;

bus.removeListener( 'foo' , onFoo1 ) ;
expect( bus.listeners( 'foo' ).length ).to.be( 0 ) ;
expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;

bus.once( 'foo' , onFoo1 ) ;
listeners = bus.listeners( 'foo' ) ;
expect( listeners.length ).to.be( 1 ) ;
expect( listeners[ 0 ].id ).to.be( onFoo1 ) ;
expect( listeners[ 0 ].fn ).to.be( onFoo1 ) ;
expect( listeners[ 0 ].event ).to.be( 'foo' ) ;
expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;

bus.emit( 'foo' ) ;
listeners = bus.listeners( 'foo' ) ;
expect( bus.listeners( 'foo' ).length ).to.be( 0 ) ;
expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;
```

<a name="next-gen-feature-async-emitting"></a>
# Next Gen feature: async emitting
should emit synchronously, with a synchronous flow (nice = NextGenEvents.SYNC).

```js
asyncEventTest( NextGenEvents.SYNC , undefined , undefined , undefined , function( order ) {
	expect( order ).to.eql( [ 'listener' , 'flow' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'setTimeout20' ] ) ;
	done() ;
} ) ;
```

should emit asynchronously, with an asynchronous flow, as fast as possible (nice = NextGenEvents.NEXT_TICK).

```js
asyncEventTest( NextGenEvents.NEXT_TICK , undefined , undefined , undefined , function( order ) {
	expect( order ).to.eql( [ 'flow' , 'listener' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'setTimeout20' ] ) ;
	done() ;
} ) ;
```

should emit asynchronously, with an asynchronous flow, almost as fast as possible (nice = NextGenEvents.IMMEDIATE).

```js
asyncEventTest( NextGenEvents.IMMEDIATE , undefined , undefined , undefined , function( order ) {
	expect( order ).to.eql( [ 'flow' , 'nextTick' , 'listener' , 'setImmediate' , 'setTimeout5' , 'setTimeout20' ] ) ;
	done() ;
} ) ;
```

should emit asynchronously, with an asynchronous flow, with minimal delay (nice = NextGenEvents.TIMEOUT).

```js
asyncEventTest( NextGenEvents.TIMEOUT , undefined , undefined , undefined , function( order ) {
	try {
		expect( order ).to.eql( [ 'flow' , 'nextTick' , 'setImmediate' , 'listener' , 'setTimeout5' , 'setTimeout20' ] ) ;
	}
	catch( error ) {
		// Sometime setImmediate() is unpredictable and is slower than setTimeout(fn,0)
		// It is a bug of V8, not a bug of the async lib
		expect( order ).to.eql( [ 'flow' , 'nextTick' , 'listener' , 'setImmediate' , 'setTimeout5' , 'setTimeout20' ] ) ;
	}
	done() ;
} ) ;
```

should emit asynchronously, with an asynchronous flow, with a 10ms delay (nice = 1 -> setTimeout 10ms).

```js
asyncEventTest( 1 , undefined , undefined , undefined , function( order ) {
	expect( order ).to.eql( [ 'flow' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'listener' , 'setTimeout20' ] ) ;
	done() ;
} ) ;
```

should emit asynchronously, with an asynchronous flow, with a 30ms delay (nice = 3 -> setTimeout 30ms).

```js
asyncEventTest( 3 , undefined , undefined , undefined , function( order ) {
	expect( order ).to.eql( [ 'flow' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'setTimeout20' , 'listener' ] ) ;
	done() ;
} ) ;
```

.emit( nice , event , ... ) should overide emitter's nice value.

```js
asyncEventTest( undefined , 1 , undefined , undefined , function( order ) {
	expect( order ).to.eql( [ 'flow' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'listener' , 'setTimeout20' ] ) ;
	asyncEventTest( NextGenEvents.SYNC , 1 , undefined , undefined , function( order ) {
		expect( order ).to.eql( [ 'flow' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'listener' , 'setTimeout20' ] ) ;
		asyncEventTest( 10 , 1 , undefined , undefined , function( order ) {
			expect( order ).to.eql( [ 'flow' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'listener' , 'setTimeout20' ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;
```

should use the highest nice value between the context's nice, the listener's nice and the emitter's nice.

```js
asyncEventTest( undefined , 1 , NextGenEvents.SYNC , NextGenEvents.SYNC , function( order ) {
	expect( order ).to.eql( [ 'flow' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'listener' , 'setTimeout20' ] ) ;
	asyncEventTest( undefined , NextGenEvents.SYNC , 1 , NextGenEvents.SYNC , function( order ) {
		expect( order ).to.eql( [ 'flow' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'listener' , 'setTimeout20' ] ) ;
		asyncEventTest( undefined , NextGenEvents.SYNC , NextGenEvents.SYNC , 1 , function( order ) {
			expect( order ).to.eql( [ 'flow' , 'nextTick' , 'setImmediate' , 'setTimeout5' , 'listener' , 'setTimeout20' ] ) ;
			done() ;
		} ) ;
	} ) ;
} ) ;
```

<a name="next-gen-feature-contexts"></a>
# Next Gen feature: contexts
when a listener is tied to a context, it should stop receiving events if the context is disabled (implicit context declaration).

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var triggered = 0 ;

bus.on( 'foo' , {
	context: 'bar' ,
	fn: function() { triggered ++ ; }
} ) ;

bus.emit( 'foo' ) ;
expect( triggered ).to.be( 1 ) ;

bus.disableListenerContext( 'bar' ) ;
bus.emit( 'foo' ) ;
bus.emit( 'foo' ) ;
bus.emit( 'foo' ) ;
expect( triggered ).to.be( 1 ) ;

bus.enableListenerContext( 'bar' ) ;
bus.emit( 'foo' ) ;
expect( triggered ).to.be( 2 ) ;
```

when a listener is tied to a context, it should stop receiving events if the context is disabled (explicit context declaration).

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var triggered = 0 ;

bus.addListenerContext( 'bar' , { status: NextGenEvents.CONTEXT_DISABLED } ) ;

bus.on( 'foo' , {
	context: 'bar' ,
	fn: function() { triggered ++ ; }
} ) ;

bus.emit( 'foo' ) ;
bus.emit( 'foo' ) ;
bus.emit( 'foo' ) ;
expect( triggered ).to.be( 0 ) ;

bus.enableListenerContext( 'bar' ) ;
bus.emit( 'foo' ) ;
expect( triggered ).to.be( 1 ) ;

bus.disableListenerContext( 'bar' ) ;
bus.emit( 'foo' ) ;
expect( triggered ).to.be( 1 ) ;

bus.enableListenerContext( 'bar' ) ;
bus.emit( 'foo' ) ;
expect( triggered ).to.be( 2 ) ;
```

.destroyListenerContext() should destroy a context and all listeners tied to it.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var stats = { count: {} , orders: [] } ;

bus.on( 'foo' , {
	id: 'foo1' ,
	context: 'bar' ,
	fn: genericListener.bind( undefined , 'foo1' , stats , undefined )
} ) ;

bus.on( 'foo' , {
	id: 'foo2' ,
	context: 'bar' ,
	fn: genericListener.bind( undefined , 'foo2' , stats , undefined )
} ) ;

bus.on( 'baz' , {
	id: 'baz1' ,
	context: 'bar' ,
	fn: genericListener.bind( undefined , 'baz1' , stats , undefined )
} ) ;

bus.on( 'baz' , {
	id: 'baz2' ,
	context: 'qux' ,
	fn: genericListener.bind( undefined , 'baz2' , stats , undefined )
} ) ;

bus.emit( 'foo' ) ;
expect( stats.count ).to.eql( { foo1: 1 , foo2: 1 } ) ;
bus.emit( 'baz' ) ;
expect( stats.count ).to.eql( { foo1: 1 , foo2: 1 , baz1: 1 , baz2: 1 } ) ;

bus.destroyListenerContext( 'bar' ) ;
bus.emit( 'foo' ) ;
expect( stats.count ).to.eql( { foo1: 1 , foo2: 1 , baz1: 1 , baz2: 1 } ) ;
bus.emit( 'baz' ) ;
expect( stats.count ).to.eql( { foo1: 1 , foo2: 1 , baz1: 1 , baz2: 2 } ) ;

bus.destroyListenerContext( 'qux' ) ;
bus.emit( 'foo' ) ;
expect( stats.count ).to.eql( { foo1: 1 , foo2: 1 , baz1: 1 , baz2: 2 } ) ;
bus.emit( 'baz' ) ;
expect( stats.count ).to.eql( { foo1: 1 , foo2: 1 , baz1: 1 , baz2: 2 } ) ;
```

<a name="next-gen-feature-contexts-queue"></a>
# Next Gen feature: contexts queue
.queueListenerContext() should pause the context, queueing events, .enableListenerContext() should resume pending events emitting.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var stats = { count: {} , orders: [] } ;

bus.on( 'foo' , {
	id: 'foobar' ,
	context: 'qux' ,
	fn: genericListener.bind( undefined , 'foobar' , stats , function() {
		var args = Array.prototype.slice.call( arguments ) ;
		switch ( stats.count.foobar )
		{
			case 1 :
				expect( args ).to.eql( [ 'one' , 'two' , 'three' ] ) ;
				break ;
			case 2 :
				expect( args ).to.eql( [ 'four' , 'five' , 'six' ] ) ;
				break ;
			case 3 :
				expect( args ).to.eql( [] ) ;
				break ;
			case 4 :
				expect( args ).to.eql( [ 'seven' ] ) ;
				break ;
		}
	} )
} ) ;

bus.on( 'foo' , {
	id: 'foobaz' ,
	context: 'qux' ,
	fn: genericListener.bind( undefined , 'foobaz' , stats , function() {
		var args = Array.prototype.slice.call( arguments ) ;
		switch ( stats.count.foobaz )
		{
			case 1 :
				expect( args ).to.eql( [ 'one' , 'two' , 'three' ] ) ;
				break ;
			case 2 :
				expect( args ).to.eql( [ 'four' , 'five' , 'six' ] ) ;
				break ;
			case 3 :
				expect( args ).to.eql( [] ) ;
				break ;
			case 4 :
				expect( args ).to.eql( [ 'seven' ] ) ;
				break ;
		}
	} )
} ) ;

bus.on( 'qbar' , {
	id: 'qbarbaz' ,
	context: 'qbarbaz' ,
	fn: genericListener.bind( undefined , 'qbarbaz' , stats , undefined )
} ) ;

bus.emit( 'foo' , 'one' , 'two' , 'three' ) ;
bus.emit( 'qbar' ) ;
expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , qbarbaz: 1 } ) ;

bus.queueListenerContext( 'qux' ) ;
bus.emit( 'foo' , 'four' , 'five' , 'six' ) ;
bus.emit( 'foo' ) ;
bus.emit( 'foo' , 'seven' ) ;
bus.emit( 'qbar' ) ;
expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , qbarbaz: 2 } ) ;

bus.enableListenerContext( 'qux' ) ;
expect( stats.count ).to.eql( { foobar: 4 , foobaz: 4 , qbarbaz: 2 } ) ;
```

<a name="next-gen-feature-contexts-serialization"></a>
# Next Gen feature: contexts serialization
3 async listeners for an event, tied to a serial context, each listener should be triggered one after the other.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var stats = { count: {} , orders: [] } ;

bus.on( 'foo' , {
	id: 'foobar' ,
	context: 'qux' ,
	async: true ,
	fn: genericListener.bind( undefined , 'foobar' , stats , function() {
		var callback = arguments[ arguments.length - 1 ] ;
		setTimeout( callback , 30 ) ;
	} )
} ) ;

bus.on( 'foo' , {
	id: 'foobaz' ,
	context: 'qux' ,
	async: true ,
	fn: genericListener.bind( undefined , 'foobaz' , stats , function() {
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 } ) ;
		var callback = arguments[ arguments.length - 1 ] ;
		setTimeout( callback , 30 ) ;
	} )
} ) ;

bus.on( 'foo' , {
	id: 'foobarbaz' ,
	context: 'qux' ,
	async: true ,
	fn: genericListener.bind( undefined , 'foobarbaz' , stats , function() {
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
		var callback = arguments[ arguments.length - 1 ] ;
		setTimeout( function() {
			callback() ;
			done() ;
		} , 30 ) ;
	} )
} ) ;

bus.serializeListenerContext( 'qux' ) ;
bus.emit( 'foo' ) ;
expect( stats.count ).to.eql( { foobar: 1 } ) ;
```

3 async listeners for 3 events, tied to a serial context, each listener should be triggered one after the other.

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var stats = { count: {} , orders: [] } ;

bus.on( 'bar' , {
	id: 'foobar' ,
	context: 'qux' ,
	async: true ,
	fn: genericListener.bind( undefined , 'foobar' , stats , function() {
		var callback = arguments[ arguments.length - 1 ] ;
		setTimeout( callback , 30 ) ;
	} )
} ) ;

bus.on( 'baz' , {
	id: 'foobaz' ,
	context: 'qux' ,
	async: true ,
	fn: genericListener.bind( undefined , 'foobaz' , stats , function() {
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 } ) ;
		var callback = arguments[ arguments.length - 1 ] ;
		setTimeout( callback , 30 ) ;
	} )
} ) ;

bus.on( 'barbaz' , {
	id: 'foobarbaz' ,
	context: 'qux' ,
	async: true ,
	fn: genericListener.bind( undefined , 'foobarbaz' , stats , function() {
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
		var callback = arguments[ arguments.length - 1 ] ;
		setTimeout( function() {
			callback() ;
			done() ;
		} , 30 ) ;
	} )
} ) ;

bus.serializeListenerContext( 'qux' ) ;
bus.emit( 'bar' ) ;
bus.emit( 'baz' ) ;
bus.emit( 'barbaz' ) ;
expect( stats.count ).to.eql( { foobar: 1 } ) ;
```

mixing sync and async listeners tied to a serial context, sync event should not block (test 1).

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var stats = { count: {} , orders: [] } ;

bus.on( 'bar' , {
	id: 'foobar' ,
	context: 'qux' ,
	fn: genericListener.bind( undefined , 'foobar' , stats , function() {
	} )
} ) ;

bus.on( 'baz' , {
	id: 'foobaz' ,
	context: 'qux' ,
	fn: genericListener.bind( undefined , 'foobaz' , stats , function() {
	} )
} ) ;

bus.on( 'barbaz' , {
	id: 'foobarbaz' ,
	context: 'qux' ,
	async: true ,
	fn: genericListener.bind( undefined , 'foobarbaz' , stats , function() {
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
		var callback = arguments[ arguments.length - 1 ] ;
		setTimeout( function() {
			callback() ;
			done() ;
		} , 30 ) ;
	} )
} ) ;

bus.serializeListenerContext( 'qux' ) ;
bus.emit( 'bar' ) ;
bus.emit( 'baz' ) ;
bus.emit( 'barbaz' ) ;
expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
```

mixing sync and async listeners tied to a serial context, sync event should not block (test 2).

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var stats = { count: {} , orders: [] } ;

bus.on( 'bar' , {
	id: 'foobar' ,
	context: 'qux' ,
	fn: genericListener.bind( undefined , 'foobar' , stats , function() {
	} )
} ) ;

bus.on( 'baz' , {
	id: 'foobaz' ,
	context: 'qux' ,
	async: true ,
	fn: genericListener.bind( undefined , 'foobaz' , stats , function() {
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 } ) ;
		var callback = arguments[ arguments.length - 1 ] ;
		setTimeout( callback , 30 ) ;
	} )
} ) ;

bus.on( 'barbaz' , {
	id: 'foobarbaz' ,
	context: 'qux' ,
	async: true ,
	fn: genericListener.bind( undefined , 'foobarbaz' , stats , function() {
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
		var callback = arguments[ arguments.length - 1 ] ;
		setTimeout( function() {
			callback() ;
			done() ;
		} , 30 ) ;
	} )
} ) ;

bus.serializeListenerContext( 'qux' ) ;
bus.emit( 'bar' ) ;
bus.emit( 'baz' ) ;
bus.emit( 'barbaz' ) ;
expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 } ) ;
```

mixing sync and async listeners tied to a serial context, sync event should not block (test 3).

```js
var bus = Object.create( NextGenEvents.prototype ) ;

var stats = { count: {} , orders: [] } ;

bus.on( 'bar' , {
	id: 'foobar' ,
	context: 'qux' ,
	async: true ,
	fn: genericListener.bind( undefined , 'foobar' , stats , function() {
		var callback = arguments[ arguments.length - 1 ] ;
		setTimeout( callback , 30 ) ;
	} )
} ) ;

bus.on( 'baz' , {
	id: 'foobaz' ,
	context: 'qux' ,
	fn: genericListener.bind( undefined , 'foobaz' , stats , function() {
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 } ) ;
		
		// 'barbaz' should trigger immediately
		process.nextTick( function() {
			expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
		} ) ;
	} )
} ) ;

bus.on( 'barbaz' , {
	id: 'foobarbaz' ,
	context: 'qux' ,
	async: true ,
	fn: genericListener.bind( undefined , 'foobarbaz' , stats , function() {
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
		var callback = arguments[ arguments.length - 1 ] ;
		setTimeout( function() {
			callback() ;
			done() ;
		} , 30 ) ;
	} )
} ) ;

bus.serializeListenerContext( 'qux' ) ;
bus.emit( 'bar' ) ;
bus.emit( 'baz' ) ;
bus.emit( 'barbaz' ) ;
expect( stats.count ).to.eql( { foobar: 1 } ) ;
```

