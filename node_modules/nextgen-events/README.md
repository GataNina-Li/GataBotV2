

# NextGen Events

The next generation of events handling!

* License: MIT
* Current status: stable
* Platform: Node.js and browsers

*NextGen Events* solves common trouble that one may encounter when dealing with events and listeners.

## Feature highlights:

* Standard event-handling 99% compatible with Node.js built-in events
* `.emit()` supports a completion callback
* Support for asynchronous event-handling
* Multiple listeners can be tied to a single context
* A context can be temporarly *disabled*
* A context can be in *queue* mode: events for its listeners are stored, they will be *resumed* when the context is enabled again
* A context can be in serialization mode: each sync/async listener run once the previous sync/async listener has fully completed
* Interruptible event emitting: if the emitter is interruptible, a listener can stop downstream propagation,
  thus emitting an 'interrupt' event
* **NEW: state-events**: so late listeners will never miss the *ready* event again!
* **NEW: handling group of emitters**
* **NEW: proxy services!** Abstract away your network: emit and listen to emitter on the other side of the plug!
* **NEW: .waitFor()/.waitForAll()** the Promise returning variant of `.once()`!
* **NEW: .waitForEmit()** the Promise returning variant of `.emit()` + *completion callback*

Emitting events asynchronously or registering a listener that will be triggered asynchronously because it performs
non-critical tasks has some virtues: it gives some breath to the event-loop, so important I/O can be processed as soon as possible.

You will love the *state-event* concept: you define a *state* bounded to the event of the same name, and when the bounded event fire,
that state is *turned on*.
If a new listener is added for that event and the bounded state is *on*, the new listener is triggered immediately with
the same arguments that was previously *emitted*.
You will typically make events like *ready*, *open*, *end* or *close*, etc, *state-events*, **so late listeners will never miss
your event again!**

Contexts are really useful, it handles a collection of listeners.
At first glance, it looks like a sort of namespace for listeners.
But it can do more than that: you can turn a context off, so every listener tied to this context will not be triggered anymore.
Then turn it on and they will be available again. 

You can even switch a context into queue mode: the listeners tied to it will not be triggered, but events for those
listeners will be stored in the context. When the context is resumed, all retained events will trigger their listeners.
This allow one to postpone some operations, while performing some other high priority tasks, but be careful:
depending on your application nature, the queue may grow fast and consumes a lot of memory very quickly.

One of the top feature of this lib is the context serialization: it greatly eases the flow of the code!
When differents events can fire at the same time, there are use cases when one does not want that async listeners run concurrently.
The context serialization feature will ensure you that no concurrency will happen for listeners tied to it.
You do not have to code fancy or complicated tests to cover all cases anymore: just let *NextGen Events* do it for you!

**Proxy services are awesome.** They abstract away the network so we can emit and listen to emitter on the other side of the plug!
Both side of the channel create a Proxy, and add to it local and remote *services*, i.e. event emitters, and that's all.
A remote service looks like a normal (i.e. local) emitter, and share the same API (with few limitations).
It's totally protocol agnostic, you just define two methods for your proxy: one to read from the network and one to send to it
(e.g. for Web Socket, this is a one-liner).



# Install

Use npm:

```
npm install nextgen-events
```


# Getting started

By the way you can create an event emitter simply by creating a new object, this way:

```js
var NgEmitter = require( 'nextgen-events' ) ;
var emitter = new NgEmitter() ;
```

You can use `var emitter = Object.create( NgEmitter.prototype )` as well, the object does not need the constructor.

But in real life, you would make your own objects inherit it:

```js
var NgEmitter = require( 'nextgen-events' ) ;

function myClass()
{
	// myClass constructor code here
}

myClass.prototype = Object.create( NgEmitter.prototype ) ;
myClass.prototype.constructor = myClass ;	// restore the constructor

// define other methods for myClass...
```

The basis of the event emitter works like Node.js built-in events:

```js
var NgEmitter = require( 'nextgen-events' ) ;
var emitter = new NgEmitter() ;

// Normal listener
emitter.on( 'message' , function( message ) {
	console.log( 'Message received: ' , message ) ;
} ) ;

// One time listener:
emitter.once( 'close' , function() {
	console.log( 'Connection closed!' ) ;
} ) ;

// The error listener: if it is not defined, the error event will throw an exception
emitter.on( 'error' , function( error ) {
	console.log( 'Shit happens: ' , error ) ;
} ) ;

emitter.emit( 'message' , 'Hello world!' ) ;
// ...
```



# References

## Table of Content

* [Events](doc/documentation.md#ref.events)
	* [.addListener() / .on()](doc/documentation.md#ref.events.addListener)
	* [.once()](doc/documentation.md#ref.events.once)
	* [.waitFor()](doc/documentation.md#ref.events.waitFor)
	* [.waitForAll()](doc/documentation.md#ref.events.waitForAll)
	* [.removeListener() / .off()](doc/documentation.md#ref.events.removeListener)
	* [.removeAllListeners()](doc/documentation.md#ref.events.removeAllListeners)
	* [.setMaxListeners()](doc/documentation.md#ref.events.setMaxListeners)
	* [.listeners()](doc/documentation.md#ref.events.listeners)
	* [.listenerCount()](doc/documentation.md#ref.events.listenerCount)
	* [.emit()](doc/documentation.md#ref.events.emit)
	* [.waitForEmit()](doc/documentation.md#ref.events.waitForEmit)
	* [.defineStates()](doc/documentation.md#ref.events.defineStates)
	* [.hasState()](doc/documentation.md#ref.events.hasState)
	* [.getAllStates()](doc/documentation.md#ref.events.getAllStates)
	* [.setNice()](doc/documentation.md#ref.events.setNice)
	* [.desyncUseNextTick()](doc/documentation.md#ref.events.desyncUseNextTick)
	* [.setInterruptible()](doc/documentation.md#ref.events.setInterruptible)
	* [.addListenerContext()](doc/documentation.md#ref.events.addListenerContext)
	* [.disableListenerContext()](doc/documentation.md#ref.events.disableListenerContext)
	* [.queueListenerContext()](doc/documentation.md#ref.events.queueListenerContext)
	* [.enableListenerContext()](doc/documentation.md#ref.events.enableListenerContext)
	* [.setListenerContextNice()](doc/documentation.md#ref.events.setListenerContextNice)
	* [.serializeListenerContext()](doc/documentation.md#ref.events.serializeListenerContext)
	* [.destroyListenerContext()](doc/documentation.md#ref.events.destroyListenerContext)
	* [NextGenEvents.reset()](doc/documentation.md#ref.events.reset)
	* [NextGenEvents.share()](doc/documentation.md#ref.events.share)
	* [NextGenEvents.groupAddListener() / NextGenEvents.groupOn()](doc/documentation.md#ref.events.groupAddListener)
	* [NextGenEvents.groupOnce()](doc/documentation.md#ref.events.groupOnce)
	* [NextGenEvents.groupGlobalOnce()](doc/documentation.md#ref.events.groupGlobalOnce)
	* [NextGenEvents.groupGlobalOnceAll()](doc/documentation.md#ref.events.groupGlobalOnceAll)
	* [NextGenEvents.groupRemoveListener() / NextGenEvents.groupOff()](doc/documentation.md#ref.events.groupRemoveListener)
	* [NextGenEvents.groupRemoveAllListener()](doc/documentation.md#ref.events.groupRemoveAllListener)
	* [NextGenEvents.groupEmit()](doc/documentation.md#ref.events.groupEmit)
	* [NextGenEvents.groupDefineStates()](doc/documentation.md#ref.events.groupDefineStates)
	* [Built-in events](doc/documentation.md#ref.builtin-events)
		* [Error event](doc/documentation.md#ref.builtin-events.error)
		* [NewListener event](doc/documentation.md#ref.builtin-events.newListener)
		* [RemoveListener event](doc/documentation.md#ref.builtin-events.removeListener)
		* [Interrupt event](doc/documentation.md#ref.builtin-events.interrupt)
	* [the *nice feature*](doc/documentation.md#ref.note.nice)
	* [incompatibilities](doc/documentation.md#incompatibilities)
* [Proxy Services](doc/documentation.md#ref.proxy)



