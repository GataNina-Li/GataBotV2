

# NextGen Events References

## Table of Content

* [Events](#ref.events)
	* [.addListener() / .on()](#ref.events.addListener)
	* [.once()](#ref.events.once)
	* [.waitFor()](#ref.events.waitFor)
	* [.waitForAll()](#ref.events.waitForAll)
	* [.removeListener() / .off()](#ref.events.removeListener)
	* [.removeAllListeners()](#ref.events.removeAllListeners)
	* [.setMaxListeners()](#ref.events.setMaxListeners)
	* [.getMaxListeners()](#ref.events.getMaxListeners)
	* [.listeners()](#ref.events.listeners)
	* [.listenerCount()](#ref.events.listenerCount)
	* [.emit()](#ref.events.emit)
	* [.waitForEmit()](#ref.events.waitForEmit)
	* [.defineStates()](#ref.events.defineStates)
	* [.hasState()](#ref.events.hasState)
	* [.getAllStates()](#ref.events.getAllStates)
	* [.setNice()](#ref.events.setNice)
	* [.desyncUseNextTick()](#ref.events.desyncUseNextTick)
	* [.setInterruptible()](#ref.events.setInterruptible)
	* [.setListenerPriority()](#ref.events.setListenerPriority)
	* [.addListenerContext()](#ref.events.addListenerContext)
	* [.getListenerContext()](#ref.events.getListenerContext)
	* [.disableListenerContext()](#ref.events.disableListenerContext)
	* [.queueListenerContext()](#ref.events.queueListenerContext)
	* [.enableListenerContext()](#ref.events.enableListenerContext)
	* [.setListenerContextNice()](#ref.events.setListenerContextNice)
	* [.serializeListenerContext()](#ref.events.serializeListenerContext)
	* [.destroyListenerContext()](#ref.events.destroyListenerContext)
	* [NextGenEvents.reset()](#ref.events.reset)
	* [NextGenEvents.share()](#ref.events.share)
	* [NextGenEvents.groupAddListener() / NextGenEvents.groupOn()](#ref.events.groupAddListener)
	* [NextGenEvents.groupOnce()](#ref.events.groupOnce)
	* [NextGenEvents.groupWaitFor()](#ref.events.groupWaitFor)
	* [NextGenEvents.groupWaitForAll()](#ref.events.groupWaitForAll)
	* [NextGenEvents.groupOnceFirst()](#ref.events.groupOnceFirst)
	* [NextGenEvents.groupWaitForFirst()](#ref.events.groupWaitForFirst)
	* [NextGenEvents.groupWaitForFirstAll()](#ref.events.groupWaitForFirstAll)
	* [NextGenEvents.groupOnceLast()](#ref.events.groupOnceLast)
	* [NextGenEvents.groupWaitForLast()](#ref.events.groupWaitForLast)
	* [NextGenEvents.groupWaitForLastAll()](#ref.events.groupWaitForLastAll)
	* [NextGenEvents.groupRemoveListener() / NextGenEvents.groupOff()](#ref.events.groupRemoveListener)
	* [NextGenEvents.groupRemoveAllListener()](#ref.events.groupRemoveAllListener)
	* [NextGenEvents.groupEmit()](#ref.events.groupEmit)
	* [NextGenEvents.groupWaitForEmit()](#ref.events.groupWaitForEmit)
	* [NextGenEvents.groupDefineStates()](#ref.events.groupDefineStates)
	* [Built-in events](#ref.builtin-events)
		* [Error event](#ref.builtin-events.error)
		* [NewListener event](#ref.builtin-events.newListener)
		* [RemoveListener event](#ref.builtin-events.removeListener)
		* [Interrupt event](#ref.builtin-events.interrupt)
	* [the *nice feature*](#ref.note.nice)
	* [incompatibilities](#incompatibilities)
* [Proxy Services](#ref.proxy)



<a name="ref.events"></a>
## Events

<a name="ref.events.addListener"></a>
### .addListener( eventName , [fn] , [options] )   *or*   .on( eventName , [fn] , [options] )

* eventName `string` the name of the event to bind to
* fn `Function` the callback function for this event, this argument is optional: it can be passed to the `fn` property of `options`
* options `Object` where:
	* fn `Function` (mandatory if no `fn` argument provided) the listener function
	* id `any type` (default to the provided *fn* function) the identifier of the listener, useful if we have to remove it later
	* once `boolean` (default: false) *true* if this is a one-time-listener
	* unique `boolean` (default: false) if set, the listener will not be added if there is already another listener with the same ID for this event
	* context `string` (default: undefined - no context) a non-empty string identifying a context, if defined the listener
	  will be tied to this context, if this context is unexistant, it will be implicitly defined with default behaviour
	* nice `integer` (default: -Infinity) see [the nice feature](#ref.note.nice) for details
	* priority `integer` (default: 0) the listener priority, see [.setListenerPriority()](#ref.events.setListenerPriority) for details
	* async `boolean` (default: false) set it to *true* if the listener is async by nature and a context serialization is wanted,
	  when *async* is set for a listener, it **MUST** accept a completion callback as its last argument.
	* eventObject `boolean` (default: false) if set, the listener will be passed an unique argument: the very same event object
	  that is returned by `.emit()`, if the listener is async, a second argument is passed as the callback

Node.js documentation:

> Adds a listener to the end of the listeners array for the specified event.
> No checks are made to see if the listener has already been added.
> Multiple calls passing the same combination of event and listener will result in the listener being added multiple times.

```js
server.on( 'connection' , function( stream ) {
	console.log( 'someone connected!' ) ;
} ) ;
```

> Returns emitter, so calls can be chained.

Example, creating implicitly a context the listeners will be tied to:

```js
server.on( 'connection' , {
	context: 'ctx' ,
	fn: function( stream ) {
		console.log( 'someone connected!' ) ;
	}
} ) ;

server.on( 'close' , {
	context: 'ctx' ,
	fn: function() {
		console.log( 'connection closed!' ) ;
		
		// Destroy the context and all listeners tied to it:
		server.destroyListenerContext( 'ctx' ) ;
	}
} ) ;

server.on( 'error' , {
	context: 'ctx' ,
	fn: function() {
		// some error handling code
		
		// Destroy the context and all listeners tied to it:
		server.destroyListenerContext( 'ctx' ) ;
	}
} ) ;
```

When an async listener is defined, the completion callback is automatically added at the end of the arguments 
supplied to [.emit()](#ref.events.emit) for any listeners with *async = true*.



<a name="ref.events.once"></a>
### .once( eventName , [fn] , [options] )

* eventName `string` the name of the event to bind to
* fn `Function` the callback function for this event, this argument is optional: it can be passed to the `fn` property of `options`
* options `Object` see [.addListener()](#ref.events.addListener) for details.

Node.js documentation:

> Adds a **one time** listener for the event.
> This listener is invoked only the next time the event is fired, after which it is removed. 

```js
server.once( 'connection' , function( stream ) {
	console.log( 'Ah, we have our first user!' ) ;
} ) ;
```

> Returns emitter, so calls can be chained.

Note that using `.once()` in *NextGen Events* lib is just a syntactic sugar (and it's also there for compatibility),
the previous example can be rewritten using `.on()`:

```js
server.on( 'connection' , {
	fn: function( stream ) {
		console.log( 'Ah, we have our first user!' ) ;
	} ,
	once: true
} ) ;
```



<a name="ref.events.waitFor"></a>
### .waitFor( eventName )

* eventName `string` the name of the event to wait for

This is the *Promise-returning* variant of `.once()`, it returns a `Promise` that resolve once the event triggered, to value
of the first argument of the event.

It's even better to use it with [.defineStates](ref.events.defineStates).

Example:
```js
var emitter = new NextGenEvents() ;

emitter.defineStates( 'connect' ) ;
emitter.emit( 'connect' , remote ) ;

// ... somewhere else or in another file...

var remote = await emitter.waitFor( 'connect' ) ;

// Now we are sure that we are ready!
// We can connect to the DB or whatever your emitter is for...
```



<a name="ref.events.waitForAll"></a>
### .waitForAll( eventName )

* eventName `string` the name of the event to wait for

This is the *Promise-returning* variant of `.once()`, it returns a `Promise` that resolve once the event triggered, to value
of the array of all arguments of the event.

It's even better to use it with [.defineStates](ref.events.defineStates).



<a name="ref.events.removeListener"></a>
### .removeListener( eventName , listenerID )   *or*   .off( eventName , listenerID )

* eventName `string` the name of the event the listener to remove is binded to
* listenerID `any type` the identifier of the listener to remove

Node.js documentation:

> Remove a listener from the listener array for the specified event.
> **Caution**: changes array indices in the listener array behind the listener. 

```js
var callback = function( stream ) {
	console.log( 'someone connected!' ) ;
} ;

server.on( 'connection' , callback ) ;
// ...
server.removeListener( 'connection' , callback ) ;
```

**CAUTION: Unlike the built-in Node.js emitter**, `.removeListener()` will remove **ALL** listeners whose ID is matching
the given *listenerID*.
If any single listener has been added multiple times to the listener array for the specified event, then only one
call to `.removeListener()` will remove them all.

> Returns emitter, so calls can be chained.

Example using user-defined ID:

```js
var callback = function( stream ) {
	console.log( 'someone connected!' ) ;
} ;

server.on( 'connection' , { id: 'foo' , fn: callback } ) ;
server.on( 'connection' , { id: 'bar' , fn: callback } ) ;

// ...

// Does nothing! we have used custom IDs!
server.removeListener( 'connection' , callback ) ;

// Remove the first listener only, despite the fact they are sharing the same function
server.removeListener( 'connection' , 'foo' ) ;
```

Don't forget that by default, the ID is the callback function itself.



<a name="ref.events.removeAllListeners"></a>
### .removeAllListeners( [eventName] )

* eventName `string` (optional) the name of the event the listeners to remove are binded to

Node.js documentation:

> Removes all listeners, or those of the specified event.
> It's not a good idea to remove listeners that were added elsewhere in the code, especially when it's on an emitter
> that you didn't create (e.g. sockets or file streams).

> Returns emitter, so calls can be chained.



<a name="ref.events.setMaxListeners"></a>
### .setMaxListeners( n )

* n `integer` the maximum number of listener.

Similar to Node.js, an emitter will print a warning when the number of listener surpass the `maxListeners` value.
This method allows the limit to be modified for this specific instance.

There is no maximum value by default.
To use a different global default value for `maxListener`, e.g. set it to 10 (the Node.js events limit),
set directly this class member: `NgEvents.defaultMaxListener = 10`.

Returns a reference to the emitter, so that calls can be chained.



<a name="ref.events.getMaxListeners"></a>
### .getMaxListeners()

It get the `maxListeners` value for this emitter, see [.setMaxListeners()](#ref.events.setMaxListeners) for details.



<a name="ref.events.listeners"></a>
### .listeners( eventName )

* eventName `string` (optional) the name of the event the listeners to list are binded to

Node.js documentation:

> Returns an array of listeners for the specified event.

```js
server.on( 'connection' , function( stream ) {
	console.log( 'someone connected!' ) ;
} ) ;

console.log( util.inspect( server.listeners( 'connection' ) ) ) ;
// output:
// [ { id: [Function], fn: [Function], nice: -Infinity, event: 'connection' } ]
```



<a name="ref.events.listenerCount"></a>
### .listenerCount( eventName )

* eventName `string` the name of the event

Node.js documentation:

> Returns the number of listeners listening to the type of event.



<a name="ref.events.emit"></a>
### .emit( [nice] , eventName , [arg1] , [arg2] , [...] , [callback] )

* nice `integer` (default: -Infinity) see [the nice feature](#ref.note.nice) for details
* eventName `string` (optional) the name of the event to emit
* arg1 `any type` (optional) first argument to transmit
* arg2 `any type` (optional) second argument to transmit
* ...
* callback `function` (optional) a completion callback triggered when all listener have finished, accepting arguments:
	* interruption `any type` if truthy, then emit was interrupted with this interrupt value (provided by userland)
	* event `Object` representing the current event

It returns an object representing the current event.

Node.js documentation:

> Execute each of the listeners in order with the supplied arguments.

**Unlike Node.js** `EventEmitter`, **it does not returns the emitter!**
Instead, it returns an event object.

The *callback* can be used in conjunction with async listener: it is triggered once all listeners have finished.
If one listener interrupts the event emitting sequence (see [.setInterruptible()](#ref.events.setInterruptible)),
the callback is triggered immediately with the *interruption value*.



<a name="ref.events.waitForEmit"></a>
### .waitForEmit( [nice] , eventName , [arg1] , [arg2] , [...] )

* nice `integer` (default: -Infinity) see [the nice feature](#ref.note.nice) for details
* eventName `string` (optional) the name of the event to emit
* arg1 `any type` (optional) first argument to transmit
* arg2 `any type` (optional) second argument to transmit
* ...

This is the *Promise-returning* variant of `.emit()` + *completionCallback*.
It returns a `Promise` that resolves once all sync/async listeners have finished, or once one listener has interrupted
the event emitting sequence (see [.setInterruptible()](#ref.events.setInterruptible)).

The promise resolve to `null` or eventually to the *interruption value*.



<a name="ref.events.defineStates"></a>
### .defineStates( exclusiveState1 , [exclusiveState2] , [exclusiveState3] , ... )

* exclusiveState* `string` the state name, bounded to the event of the same name

A *state* is bounded to an event of the same name.
This make the said event a *state-event*.
All states are *off* at creation.
Once its bounded-event fires, that state is turned *on*.

Calling `.defineStates()` with multiple arguments define a group of mutually exclusive *states*:
whenever a *state* is turned on, every other states of the group are turned *off*.

If a new listener is added for an event and its bounded state is *on*, the new listener is triggered immediately with
the same arguments that was previously *emitted*.

You will typically make events like *ready*, *open*, *end* or *close*, etc, *state-events*,
**so late listeners will never miss your event again!**

Example:
```js
var emitter = new NextGenEvents() ;

emitter.defineStates( 'ready' ) ;
emitter.emit( 'ready' ) ;

// ... later... ... ...

emitter.once( 'ready' , () => {
  // Your listener code fire immediately
} ) ;
```



<a name="ref.events.hasState"></a>
### .hasState( state )

* state `string` a state name

It returns true if that *state* is turned *on* on the *emitter*.



<a name="ref.events.getAllStates"></a>
### .getAllStates()

It returns an array containing all states turned *on* on the *emitter*.



<a name="ref.events.setNice"></a>
### .setNice( nice )

* nice `integer` (default: -Infinity) see [the nice feature](#ref.note.nice) for details

Set the default *nice value* of the current emitter.



<a name="ref.events.desyncUseNextTick"></a>
### .desyncUseNextTick( useNextTick )

* useNextTick `boolean` true: use *nextTick*, false: use *setImmediate* (or its polyfill)

Internally, *NextGen Events* will desync listener when needed.
This method allows you to choose between *nextTick()* or *setImmediate()* (or its polyfill) for that task.
By default, *setImmediate()* is used, which let the event-loop breathe.



<a name="ref.events.setInterruptible"></a>
### .setInterruptible( isInterruptible )

* isInterruptible `boolean` true if the *emitter* should be interruptible

Turn *on/off* interruption for that *emitter*.
If the *emitter* is interruptible, a listener can stop downstream propagation: it just needs to return a *truthy* value.

If the listener is async, it can either return a *truthy* value or call its callback with that *truthy* value.
By the way, interrupting asynchronously only stop other listeners from running inside a serialized context
(see [context serialization](#ref.events.serializeListenerContext)).


When doing so, an 'interrupt' event is emitted with the value (always truthy) of the interruption.

If `emit()` was called with a *completion callback* as its last argument, that callback will receive the interruption value as well.

```js
var emitter = new NextGenEvents() ;

emitter.on( 'foo' , () => {
  return new Error( 'Dang!' )
} ) ;

emitter.on( 'foo' , () => {
  // Never ever called...
} ) ;

emitter.on( 'interrupt' , ( interruption ) => {
  // interruption is eql to Error( 'Dang!' )
} ) ;

emitter.emit( 'foo' , ( interruption ) => {
  // interruption is eql to Error( 'Dang!' )
} ) ;
```



<a name="ref.events.setListenerPriority"></a>
### .setListenerPriority( hasListenerPriority )

* hasListenerPriority `boolean` true if the *emitter* should call listener in descending order of priority

Turn *on/off* listener priority for that *emitter*.
If the *emitter* has listener priority, it will always call its listener according the descending order of priority.



<a name="ref.events.addListenerContext"></a>
### .addListenerContext( contextName , options )

* contextName `string` a non-empty string identifying the context to be created
* options `Object` an object of options, where:
	* nice `integer` (default: -Infinity) see [the nice feature](#ref.note.nice) for details
	* serial `boolean` (default: false) if true, the async listeners tied to this context will run sequentially,
	  one after the other is fully completed

Create a context using the given *contextName*.
Return a *context*.

Listeners can be tied to a context, enabling some grouping features like turning them on or off just by enabling/disabling
the context, queuing them, resuming them, or forcing serialization of all async listeners.



<a name="ref.events.getListenerContext"></a>
### .getListenerContext( contextName )

* contextName `string` a non-empty string identifying the context to retrieve

Return the *context* matching the name or *undefined*.



<a name="ref.events.disableListenerContext"></a>
### .disableListenerContext( contextName )

* contextName `string` a non-empty string identifying the context to be created

It disables a context: any listeners tied to it will not be triggered anymore.

The context is not destroyed, the listeners are not removed, they are just inactive.
They can be enabled again using [.enableListenerContext()](#ref.events.enableListenerContext).



<a name="ref.events.queueListenerContext"></a>
### .queueListenerContext( contextName )

* contextName `string` a non-empty string identifying the context to be created

It switchs a context into *queue mode*: any listeners tied to it will not be triggered anymore, but every listener's call
will be queued.

When the context will be enabled again using [.enableListenerContext()](#ref.events.enableListenerContext), any queued listener's call
will be processed.



<a name="ref.events.enableListenerContext"></a>
### .enableListenerContext( contextName )

* contextName `string` a non-empty string identifying the context to be created

This enables a context previously disabled using [.disableListenerContext()](#ref.events.disableListenerContext) or queued
using [.disableListenerContext()](#ref.events.disableListenerContext).

If the context was queued, any queued listener's call will be processed right now for synchronous emitter, or a bit later
depending on the *nice value*. E.g. if a listener would have been called with a timeout of 50 ms (nice value = 5),
and the call has been queued, the timeout will apply at resume time.



<a name="ref.events.setListenerContextNice"></a>
### .setListenerContextNice( contextName , nice )

* contextName `string` a non-empty string identifying the context to be created
* nice `integer` (default: -Infinity) see [the nice feature](#ref.note.nice) for details

Set the *nice* value for the current context.



<a name="ref.events.serializeListenerContext"></a>
### .serializeListenerContext( contextName , [value] )

* contextName `string` a non-empty string identifying the context to be created
* value `boolean` (optional, default is true) if *true* the context will enable serialization for async listeners.

This is one of the top feature of this lib.

If set to *true* it enables the context serialization.

It has no effect on listeners defined without the *async* option (see [.addListener()](#ref.events.addListener)).
Listeners defined with the async option will postpone any other listener's calls part of the same context.
Those calls will be queued until the completion callback of the listener is triggered.

Example:

```js
app.on( 'maintenance' , {
	context: 'maintenanceHandlers' ,
	async: true ,
	fn: function( type , done ) {
		performSomeCriticalAsyncStuff( function() {
			console.log( 'Critical maintenance stuff finished' ) ;
			done() ;
		} ) ;
	}
} ) ;

app.serializeListenerContext( maintenanceHandlers ) ;

// ...

app.emit( 'maintenance' , 'doBackup' ) ;

// Despite the fact we emit synchronously, the listener will not be called now,
// it will be queued and called later when the previous call will be finished
app.emit( 'maintenance' , 'doUpgrade' ) ;
```

By the way, there is only one listener here that will queue itself, and only one event type is fired.
But this would work the same with multiple listener and event type, if they share the same context.

Same code with two listeners and two event type:

```js
app.on( 'doBackup' , {
	context: 'maintenanceHandlers' ,
	async: true ,
	fn: function( done ) {
		performBackup( function() {
			console.log( 'Backup finished' ) ;
			done() ;
		} ) ;
	}
} ) ;

app.on( 'doUpgrade' , {
	context: 'maintenanceHandlers' ,
	async: true ,
	fn: function( done ) {
		performUpgrade( function() {
			console.log( 'Upgrade finished' ) ;
			done() ;
		} ) ;
	}
} ) ;

app.on( 'whatever' , function() {
	// Some actions...
} ) ;

app.serializeListenerContext( maintenanceHandlers ) ;

// ...

app.emit( 'doBackup' ) ;

// Despite the fact we emit synchronously, the second listener will not be called now,
// it will be queued and called later when the first listener will have finished its job
app.emit( 'doUpgrade' ) ;

// The third listener is not part of the 'maintenanceHandlers' context, so it will be called
// right now, before the first listener finished, and before the second listener ever start
app.emit( 'whatever' ) ;
```



<a name="ref.events.destroyListenerContext"></a>
### .destroyListenerContext( contextName )

* contextName `string` a non-empty string identifying the context to be created

This destroy a context and remove all listeners tied to it.

Any queued listener's calls will be lost.



<a name="ref.events.reset"></a>
### NextGenEvents.reset( emitter )

* emitter `NextGenEvents` the *emitter* to reset

It reset an *emitter*, removing all listeners and all options.



<a name="ref.events.share"></a>
### NextGenEvents.share( source, target )

* source `NextGenEvents` the source *emitter*
* target `NextGenEvents` the target *emitter*

It makes two different *emitter* object sharing the same event bus, i.e.: everything is shared, listeners are shared, options
are shared, when one emits it emits on the other, as if it was the very same *emitter*.
The *target emitter* is reset beforehand.



<a name="ref.events.groupAddListener"></a>
### NextGenEvents.groupAddListener( emitters , eventName , [fn] , [options] )  *or*  NextGenEvents.groupOn( emitters , eventName , [fn] , [options] )

* emitters `array` of emitters
* eventName `string` the name of the event to bind to
* fn `Function` the callback function for this event, this argument is optional: it can be passed to the `fn` property of `options`
* options `Object` see [.addListener()](#ref.events.addListener) for details.

Adds a listener to a group of emitter.



<a name="ref.events.groupOnce"></a>
### NextGenEvents.groupOnce( emitters , eventName , [fn] , [options] )

* emitters `array` of emitters
* eventName `string` the name of the event to bind to
* fn `Function` the callback function for this event, this argument is optional: it can be passed to the `fn` property of `options`
* options `Object` see [.addListener()](#ref.events.addListener) for details.

Adds a **one time** listener to a group of emitter, the listener can be called once per emitter.



<a name="ref.events.groupWaitFor"></a>
### NextGenEvents.groupWaitFor( emitters , eventName )

* emitters `array` of emitters
* eventName `string` the name of the event to bind to

A Promise-returning `.groupOnce()` variant, it returns an array with the first argument for each emitter's event.



<a name="ref.events.groupWaitForAll"></a>
### NextGenEvents.groupWaitForAll( emitters , eventName )

* emitters `array` of emitters
* eventName `string` the name of the event to bind to

A Promise-returning `.groupOnce()` variant, it returns an array of array of all arguments for each emitter's event.



<a name="ref.events.groupOnceFirst"></a>
### NextGenEvents.groupOnceFirst( emitters , eventName , [fn] , [options] )

* emitters `array` of emitters
* eventName `string` the name of the event to bind to
* fn `Function` the callback function for this event, this argument is optional: it can be passed to the `fn` property of `options`
* options `Object` see [.addListener()](#ref.events.addListener) for details.

Adds a **one time** listener to a group of emitter, the listener will be called only once, by the first emitter to emit.



<a name="ref.events.groupWaitForFirst"></a>
### NextGenEvents.groupWaitForFirst( emitters , eventName )

* emitters `array` of emitters
* eventName `string` the name of the event to bind to

A Promise-returning `.groupOnceFirst()` variant, it returns the first arguments of the first emitted event.



<a name="ref.events.groupWaitForFirstAll"></a>
### NextGenEvents.groupWaitForFirstAll( emitters , eventName )

* emitters `array` of emitters
* eventName `string` the name of the event to bind to

A Promise-returning `.groupOnceFirst()` variant, it returns an array of all arguments of the first emitted event.



<a name="ref.events.groupOnceLast"></a>
### NextGenEvents.groupOnceLast( emitters , eventName , [fn] , [options] )

* emitters `array` of emitters
* eventName `string` the name of the event to bind to
* fn `Function` the callback function for this event, this argument is optional: it can be passed to the `fn` property of `options`
* options `Object` see [.addListener()](#ref.events.addListener) for details.

Adds a **one time** listener to a group of emitter, the listener will be called only once, once all emitter have emitted.
The listener receive the argument from the last event to be emitted.



<a name="ref.events.groupWaitForLast"></a>
### NextGenEvents.groupWaitForLast( emitters , eventName )

* emitters `array` of emitters
* eventName `string` the name of the event to bind to

A Promise-returning `.groupOnceLast()` variant, it returns the first arguments of the last emitted event.



<a name="ref.events.groupWaitForLastAll"></a>
### NextGenEvents.groupWaitForLastAll( emitters , eventName )

* emitters `array` of emitters
* eventName `string` the name of the event to bind to

A Promise-returning `.groupOnceLast()` variant, it returns an array of all arguments of the last emitted event.



<a name="ref.events.groupRemoveListener"></a>
### NextGenEvents.groupRemoveListener( emitters , eventName , listenerID )  *or*  NextGenEvents.groupOff( emitters , eventName , listenerID )

* emitters `array` of emitters
* eventName `string` the name of the event the listener to remove is binded to
* listenerID `any type` the identifier of the listener to remove

Removes a listener from all emitters.



<a name="ref.events.groupRemoveAllListener"></a>
### NextGenEvents.groupRemoveAllListener( emitters , eventName )

* emitters `array` of emitters
* eventName `string` the name of the event the listener to remove is binded to

Removes all listeners from all emitters.



<a name="ref.events.groupEmit"></a>
### NextGenEvents.groupEmit( emitters , [nice] , eventName , [arg1] , [arg2] , [...] , [callback] )

* emitters `array` of emitters
* nice `integer` (default: -Infinity) see [the nice feature](#ref.note.nice) for details
* eventName `string` (optional) the name of the event to emit
* arg1 `any type` (optional) first argument to transmit
* arg2 `any type` (optional) second argument to transmit
* ...
* callback `function` (optional) a completion callback triggered when all listener have done, accepting arguments:
	* interruption `any type` if truthy, then emit was interrupted with this interrupt value (provided by userland)
	* event `Object` representing the current event

Emit an event on all emitters, see [.emit()](#ref.events.emit).



<a name="ref.events.groupWaitForEmit"></a>
### .groupWaitForEmit( emitters , [nice] , eventName , [arg1] , [arg2] , [...] )

* emitters `array` of emitters
* nice `integer` (default: -Infinity) see [the nice feature](#ref.note.nice) for details
* eventName `string` (optional) the name of the event to emit
* arg1 `any type` (optional) first argument to transmit
* arg2 `any type` (optional) second argument to transmit
* ...

This is the *Promise-returning* variant of `.groupEmit()` + *completionCallback*.
It returns a `Promise` that resolves once all sync/async listeners have finished, or once one listener has interrupted
the event emitting sequence (see [.setInterruptible()](#ref.events.setInterruptible)).

The promise resolve to `null` or eventually to the *interruption value*.



<a name="ref.events.groupDefineStates"></a>
### NextGenEvents.groupDefineStates( exclusiveState1 , [exclusiveState2] , [exclusiveState3] , ... )

* exclusiveState* `string` the state name, bounded to the event of the same name

Defines states for a group of emitters, see [.defineStates()](#ref.events.defineStates).



<a name="ref.builtin-events"></a>
## Built-in Events

<a name="ref.builtin-events.error"></a>
## The *error* event ( [error] )

Node.js documentation:

> When an EventEmitter instance experiences an error, the typical action is to emit an 'error' event.
> Error events are treated as a special case in node. If there is no listener for it,
> then the default action is to print a stack trace and exit the program.



<a name="ref.builtin-events.newListener"></a>
## The *newListener* event

> All EventEmitters emit the event 'newListener' when new listeners are added. 

For the 'newListener' and 'removeListener' events, see the section about [incompatibilities](#incompatibilities), since there
are few differences with the built-in Node.js EventEmitter.



<a name="ref.builtin-events.removeListener"></a>
## The *removeListener* event

> All EventEmitters emit the event 'removeListener' when a listener is removed. 

For the 'newListener' and 'removeListener' events, see the section about [incompatibilities](#incompatibilities), since there
are few differences with the built-in Node.js EventEmitter.



<a name="ref.builtin-events.interrupt"></a>
## The *interrupt* event ( [reason] )

Emitter that are interruptible fire that event when interruption happens.



<a name="ref.note.nice"></a>
## A note about the *nice feature*

The *nice value* represent the *niceness* of the event-emitting processing.
This concept is inspired by the UNIX *nice* concept for processus (see the man page for the *nice* and *renice* command).

In this lib, this represents the asyncness of the event-emitting processing.

The constant `require( 'nextgen-events' ).SYNC` can be used to have synchronous event emitting, its value is `-Infinity`
and it's the default value.

* any nice value *N* greater than or equals to 0 will be emitted asynchronously using setTimeout() with a *N* ms timeout
  to call the listeners
* any nice value *N* lesser than 0 will emit event synchronously until *-N* recursion is reached, after that, setImmediate()
  will be used to call the listeners, the first event count as 1 recursion, so if nice=-1, all events will be asynchronously emitted,
  if nice=-2 the initial event will call the listener synchronously, but if the listener emits events on the same emitter object,
  the sub-listener will be called through setImmediate(), breaking the recursion... and so on...

They are many elements that can define their own *nice value*.

Here is how this is resolved:

* First the *emit nice value* will be the one passed to the `.emit()` method if given, or the default *emitter nice value*
  defined with [.setNice()](#ref.events.setNice).
* For each listener to be called, the real *nice value* for the current listener will be the **HIGHEST** *nice value* of
  the *emit nice value* (see above), the listener *nice value* (defined with [.addListener()](#ref.events.addListener)), and
  if the listener is tied to a context, the context *nice value* (defined with [.addListenerContext()](#ref.events.addListenerContext)
  or [.setListenerContextNice](#ref.events.setListenerContextNice))



<a name="incompatibilities"></a>
## Incompatibilities with the built-in Node.js EventEmitter

NextGen Events is almost compatible with Node.js' EventEmitter, except for few things:

* .emit() does not return the emitter, but an object representing the current event.

* If the last argument passed to .emit() is a function, it is not passed to listeners, instead it is a completion callback
  triggered when all listeners have done their job. If one want to pass function to listeners as the final argument, it is easy
  to add an extra `null` or `undefined` argument to .emit().

* There are more reserved event names: 'interrupt'.

* By default, the *listeners limit warning* is turned off (i.e.: `maxListeners` is set to Infinity).

* .removeListener() will remove all matching listener, not only the first listener found.

* 'newListener'/'removeListener' event listener will receive an array of new/removed *listener object*, instead of only one
  *listener function*.
  E.g: it will be fired only once per .removeListener()/.removeAllListener() call, even if that one call removes
  multiple listeners at once.
  It's also true for recursive/cascading removal.
  A *listener object* contains a property called 'fn' that hold the actual *listener function*.

* `.removeAllListeners()` without any argument does not trigger 'removeListener' listener, because they are actually removed too.
  The same apply to `.removeAllListeners( 'removeListener' )`.

* .listeners() same here: rather than providing an array of *listener function* an array of *listener object* is provided.



<a name="ref.proxy"></a>
## Proxy Services

**This part of the doc is still a work in progress!**

**Proxy services are awesome.** They abstract away the network so we can emit and listen to emitter on the other side of the plug!
Both side of the channel create a Proxy, and add to it local and remote *services*, i.e. event emitters, and that's all.
A remote service looks like a normal (i.e. local) emitter, and share the same API (with few limitations).

It's totally protocol agnostic, you just define two methods for your proxy: one to read from the network and one to send to it
(e.g. for Web Socket, this is a one-liner).



#### Example, using the Web Socket *ws* node module

The code below set up a server and a client written in Node.js.
The server expose the *heartBeatService* which simply emit an *heartBeat* event once in a while with the beat count as data.
Most of this code is websocket boiler-plate, the actual proxy code involves only few lines.
The client code could be easily rewritten for the browser.

**Server:**

```js
var NgEvents = require( 'nextgen-events' ) ;

// Create our service/emitter
var heartBeatEmitter = new NgEvents() ;
var nextBeat = 1 ;

// Emit one 'heartBeat' event every few seconds
setInterval( function() {
  var beat = nextBeat ++ ;
  heartBeatEmitter.emit( 'heartBeat' , beat ) ;
} , 2000 ) ;

// Create our server
var WebSocket = require( 'ws' ) ;
var server = new WebSocket.Server( { port: 12345 } ) ;

// On new connection... 
server.on( 'connection' , function connection( ws ) {
  
  // Create a proxy for this client
  var proxy = new NgEvents.Proxy() ;
  
  // Add the local service exposed to this client and grant it all right
  proxy.addLocalService( 'heartBeatService' , heartBeatEmitter ,
    { listen: true , emit: true , ack: true } ) ;
  
  // message received: just hook to proxy.receive()
  ws.on( 'message' , function incoming( message ) {
    proxy.receive( message ) ;
  } ) ;
  
  // Define the receive method: should call proxy.push()
  // after decoding the raw message
  proxy.receive = function receive( raw ) {
    try { proxy.push( JSON.parse( raw ) ) ; } catch ( error ) {}
  } ;
  
  // Define the send method
  proxy.send = function send( message ) {
    ws.send( JSON.stringify( message ) ) ;
  } ;
  
  // Clean up after everything is done
  ws.on( 'close' , function close() {
    proxy.destroy() ;
  } ) ;
} ) ;
```

**Client:**

```js
var NgEvents = require( 'nextgen-events' ) ;
var WebSocket = require( 'ws' ) ;
var ws = new WebSocket( 'ws://127.0.0.1:12345' ) ;

// Create a proxy
var proxy = new NgEvents.Proxy() ;

// Once the connection is established...
ws.on( 'open' , function open() {
  
  // Add the remote service we want to access
  proxy.addRemoteService( 'heartBeatService' ) ;
  
  // Listen to the event 'heartBeat' on this service
  proxy.remoteServices.heartBeatService.on( 'heartBeat' , function( beat ) {
    console.log( '>>> Heart Beat (%d) received!' , beat ) ;
  } ) ;
} ) ;

// message received: just hook to proxy.receive()
ws.on( 'message' , function( message ) {
  proxy.receive( message ) ;
} ) ;

// Define the receive method: should call proxy.push()
// after decoding the raw message
proxy.receive = function receive( raw ) {
  try { proxy.push( JSON.parse( raw ) ) ; } catch ( error ) {}
} ;

// Define the send method
proxy.send = function send( message ) {
  ws.send( JSON.stringify( message ) ) ;
} ;

// Clean up after everything is done
ws.on( 'close' , function close() {
  proxy.destroy() ;
} ) ;
```



Options passed to `.addLocalService()`:

* listen `boolean` if set, the remote client can listen (addListener()/on()) to the local emitter
* emit `boolean` if set, the remote client can emit on the local emitter
* ack `boolean` if set, the remote client can acknowledge or ask for acknowledgement, enabling **async listeners**
  and .emit()'s **completion callback**



*NextGen Events* features available in proxy services:

* All the basic API is supported (the node-compatible API)
* Emit completion callback supported
* Async listeners supported



Features that could be supported in the future:

* Emit interruption and retrieving the interruption value



Features that are unlikely to be supported:

* Remote emit with a nice value (does not make sense at all through a network)
* Contexts cannot be shared across different proxies/client, think of it as if they were namespaced behind their proxy


