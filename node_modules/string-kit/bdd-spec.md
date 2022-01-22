## Table of Content

* [format()](#format)
* [Escape collection](#escape-collection)
* [Camel case](#camel-case)
* [Latinize](#latinize)
* [Wordwrap](#wordwrap)
* [inspect()](#inspect)
* [Title case](#title-case)
* [Misc](#misc)
* [Unicode](#unicode)


## format()

**Should perform basic examples**

```javascript
expect( format( 'Hello world' ) ).to.be( 'Hello world' ) ;
expect( format( 'Hello %s' , 'world' ) ).to.be( 'Hello world' ) ;
expect( format( 'Hello %s %s, how are you?' , 'Joe' , 'Doe' ) ).to.be( 'Hello Joe Doe, how are you?' ) ;
expect( format( 'I have %i cookies.' , 3 ) ).to.be( 'I have 3 cookies.' ) ;
expect( format( 'This company regains %d%% of market share.' , 36 ) ).to.be( 'This company regains 36% of market share.' ) ;
expect( format( '11/8=%f' , 11/8 ) ).to.be( '11/8=1.375' ) ;
expect( format( 'Binary %b %b' , 11 , 123 ) ).to.be( 'Binary 1011 1111011' ) ;
expect( format( 'Octal %o %o' , 11 , 123 ) ).to.be( 'Octal 13 173' ) ;
expect( format( 'Hexa %h %x %x' , 11 , 11 , 123 ) ).to.be( 'Hexa b 0b 7b' ) ;
expect( format( 'JSON %J' , {hello:'world',here:'is',my:{wonderful:'object'}} ) ).to.be( 'JSON {"hello":"world","here":"is","my":{"wonderful":"object"}}' ) ;
expect( format( 'Inspect %I' , {hello:'world',here:'is',my:{wonderful:'object'}} ) ).to.be( 'Inspect <Object> <object> {\n    hello: "world" <string>(5)\n    here: "is" <string>(2)\n    my: <Object> <object> {\n        wonderful: "object" <string>(6)\n    }\n}\n' ) ;
//expect( format( 'Inspect %E' , new Error( 'Some error' ) ) ).to.be( '' ) ;
```

**%u should format unsigned integer**

```javascript
expect( format( '%u' , 123 ) ).to.be( '123' ) ;
expect( format( '%u' , 0 ) ).to.be( '0' ) ;
expect( format( '%u' , -123 ) ).to.be( '0' ) ;
expect( format( '%u' ) ).to.be( '0' ) ;
```

**%U should format *positive* unsigned integer**

```javascript
expect( format( '%U' , 123 ) ).to.be( '123' ) ;
expect( format( '%U' , 0 ) ).to.be( '1' ) ;
expect( format( '%U' , -123 ) ).to.be( '1' ) ;
expect( format( '%U' ) ).to.be( '1' ) ;
```

**%z should format as base64**

```javascript
expect( format( '%z' , 'some text' ) ).to.be( 'c29tZSB0ZXh0' ) ;
expect( format( '%z' , Buffer.from( 'some text' ) ) ).to.be( 'c29tZSB0ZXh0' ) ;
expect( format( '%z' , 'some longer text' ) ).to.be( 'c29tZSBsb25nZXIgdGV4dA==' ) ;
expect( format( '%z' , Buffer.from( 'some longer text' ) ) ).to.be( 'c29tZSBsb25nZXIgdGV4dA==' ) ;
expect( format( '%z' , Buffer.from( '+/c=' , 'base64' ) ) ).to.be( '+/c=' ) ;
```

**%Z should format as base64**

```javascript
expect( format( '%Z' , 'some text' ) ).to.be( 'c29tZSB0ZXh0' ) ;
expect( format( '%Z' , Buffer.from( 'some text' ) ) ).to.be( 'c29tZSB0ZXh0' ) ;
expect( format( '%Z' , 'some longer text' ) ).to.be( 'c29tZSBsb25nZXIgdGV4dA' ) ;
expect( format( '%Z' , Buffer.from( 'some longer text' ) ) ).to.be( 'c29tZSBsb25nZXIgdGV4dA' ) ;
expect( format( '%Z' , Buffer.from( '+/c=' , 'base64' ) ) ).to.be( '-_c' ) ;
```

**Should perform well the argument's index feature**

```javascript
expect( format( '%s%s%s' , 'A' , 'B' , 'C' ) ).to.be( 'ABC' ) ;
expect( format( '%+1s%-1s%s' , 'A' , 'B' , 'C' ) ).to.be( 'BAC' ) ;
expect( format( '%3s%s' , 'A' , 'B' , 'C' ) ).to.be( 'CBC' ) ;
```

**Should perform well the mode arguments feature**

```javascript
expect( format( '%[f0]f' , 1/3 ) ).to.be( '0' ) ;
expect( format( '%[f1]f' , 1/3 ) ).to.be( '0.3' ) ;
expect( format( '%[f2]f' , 1/3 ) ).to.be( '0.33' ) ;

expect( format( '%[f0]f' , 0.1 ) ).to.be( '0' ) ;
expect( format( '%[f1]f' , 0.1 ) ).to.be( '0.1' ) ;
expect( format( '%[f2]f' , 0.1 ) ).to.be( '0.10' ) ;

/*	p is not finished yet
expect( format( '%[p1]f' , 123 ) ).to.be( '10000' ) ;
expect( format( '%[p2]f' , 123 ) ).to.be( '12000' ) ;

expect( format( '%[p1]f' , 1/3 ) ).to.be( '0.3' ) ;
expect( format( '%[p2]f' , 1/3 ) ).to.be( '0.33' ) ;

expect( format( '%[p1]f' , 0.1 ) ).to.be( '0.1' ) ;
expect( format( '%[p2]f' , 0.1 ) ).to.be( '0.10' ) ;
*/
```

**Format.count() should count the number of arguments found**

```javascript
expect( format.count( 'blah blih blah' ) ).to.be( 0 ) ;
expect( format.count( 'blah blih %% blah' ) ).to.be( 0 ) ;
expect( format.count( '%i %s' ) ).to.be( 2 ) ;
expect( format.count( '%1i %1s' ) ).to.be( 1 ) ;
expect( format.count( '%5i' ) ).to.be( 5 ) ;
expect( format.count( '%[unexistant]F' ) ).to.be( 0 ) ;
expect( format.count( '%[unexistant:%a%a]F' ) ).to.be( 2 ) ;
```

**Format.hasFormatting() should return true if the string has formatting and thus need to be interpreted, or false otherwise**

```javascript
expect( format.hasFormatting( 'blah blih blah' ) ).to.be( false ) ;
expect( format.hasFormatting( 'blah blih %% blah' ) ).to.be( true ) ;
expect( format.hasFormatting( '%i %s' ) ).to.be( true ) ;
expect( format.hasFormatting( '%[unexistant]F' ) ).to.be( true ) ;
expect( format.hasFormatting( '%[unexistant:%a%a]F' ) ).to.be( true ) ;
```

**When using a filter object as the *this* context, the %[functionName]F format should use a custom function to format the input**

```javascript
var formatter = {
	format: formatMethod ,
	fn: {
		fixed: function() { return 'f' ; } ,
		double: function( str ) { return '' + str + str ; } ,
		fxy: function( a , b ) { return '' + ( a * a + b ) ; }
	}
} ;

expect( formatter.format( '%[fixed]F' ) ).to.be( 'f' ) ;
expect( formatter.format( '%[fixed]F%s%s%s' , 'A' , 'B' , 'C' ) ).to.be( 'fABC' ) ;
expect( formatter.format( '%s%[fxy:%a%a]F' , 'f(x,y)=' , 5 , 3 ) ).to.be( 'f(x,y)=28' ) ;
expect( formatter.format( '%s%[fxy:%+1a%-1a]F' , 'f(x,y)=' , 5 , 3 ) ).to.be( 'f(x,y)=14' ) ;
expect( formatter.format( '%[unexistant]F' ) ).to.be( '' ) ;
```

**'^' should add markup, defaulting to ansi markup**

```javascript
expect( format( 'this is ^^ a caret' ) ).to.be( 'this is ^ a caret' ) ;
expect( format( 'this is ^_underlined^: this is not' ) )
	.to.be( 'this is ' + ansi.underline + 'underlined' + ansi.reset + ' this is not' + ansi.reset ) ;
expect( format( 'this is ^_underlined^ this is not' ) )
	.to.be( 'this is ' + ansi.underline + 'underlined' + ansi.reset + ' this is not' + ansi.reset ) ;
expect( format( 'this is ^_underlined^:this is not' ) )
	.to.be( 'this is ' + ansi.underline + 'underlined' + ansi.reset + 'this is not' + ansi.reset ) ;
expect( format( 'this is ^Bblue^: this is not' ) )
	.to.be( 'this is ' + ansi.brightBlue + 'blue' + ansi.reset + ' this is not' + ansi.reset ) ;
expect( format( 'this is ^Bblue^ this is not' ) )
	.to.be( 'this is ' + ansi.brightBlue + 'blue' + ansi.reset + ' this is not' + ansi.reset ) ;
```

**'^' markup: shift feature**

```javascript
expect( format( 'this background is ^#^bblue^ this is ^wwhite' ) )
	.to.be( 'this background is ' + ansi.bgBlue + 'blue' + ansi.reset + ' this is ' + ansi.white + 'white' + ansi.reset ) ;
```

**Should expose a stand-alone markup only method**

```javascript
expect( string.markup( 'this is ^^ a caret' ) ).to.be( 'this is ^ a caret' ) ;
expect( string.markup( 'this is ^_underlined^: this is not' ) )
	.to.be( 'this is ' + ansi.underline + 'underlined' + ansi.reset + ' this is not' + ansi.reset ) ;
expect( string.markup( 'this is ^_underlined^ this is not' ) )
	.to.be( 'this is ' + ansi.underline + 'underlined' + ansi.reset + ' this is not' + ansi.reset ) ;
expect( string.markup( 'this is ^_underlined^:this is not' ) )
	.to.be( 'this is ' + ansi.underline + 'underlined' + ansi.reset + 'this is not' + ansi.reset ) ;
expect( string.markup( 'this is ^Bblue^: this is not' ) )
	.to.be( 'this is ' + ansi.brightBlue + 'blue' + ansi.reset + ' this is not' + ansi.reset ) ;
expect( string.markup( 'this is ^Bblue^ this is not' ) )
	.to.be( 'this is ' + ansi.brightBlue + 'blue' + ansi.reset + ' this is not' + ansi.reset ) ;

// format syntax should be ignored
expect( string.markup( 'this is ^Bblue^ this is not %d' , 5 ) )
	.to.be( 'this is ' + ansi.brightBlue + 'blue' + ansi.reset + ' this is not %d' + ansi.reset ) ;
```

**Should expose a stand-alone markup only method**

```javascript
var wwwFormatter = {
	endingMarkupReset: true ,
	markupReset: function( markupStack ) {
		var str = '</span>'.repeat( markupStack.length ) ;
		markupStack.length = 0 ;
		return str ;
	} ,
	markup: {
		":": function( markupStack ) {
			var str = '</span>'.repeat( markupStack.length ) ;
			markupStack.length = 0 ;
			return str ;
		} ,
		" ": function( markupStack ) {
			var str = '</span>'.repeat( markupStack.length ) ;
			markupStack.length = 0 ;
			return str + ' ' ;
		} ,
		
		"+": '<span style="font-weight:bold">' ,
		"b": '<span style="color:blue">'
	}
} ;

var markup = string.markupMethod.bind( wwwFormatter ) ;
var format = string.formatMethod.bind( wwwFormatter ) ;

expect( markup( 'this is ^^ a caret' ) ).to.be( 'this is ^ a caret' ) ;
expect( markup( 'this is ^+bold^: this is not' ) )
	.to.be( 'this is <span style="font-weight:bold">bold</span> this is not' ) ;
expect( markup( 'this is ^+bold^ this is not' ) )
	.to.be( 'this is <span style="font-weight:bold">bold</span> this is not' ) ;
expect( markup( 'this is ^+bold^:this is not' ) )
	.to.be( 'this is <span style="font-weight:bold">bold</span>this is not' ) ;
expect( markup( 'this is ^b^+blue bold' ) )
	.to.be( 'this is <span style="color:blue"><span style="font-weight:bold">blue bold</span></span>' ) ;

expect( format( 'this is ^b^+blue bold' ) )
	.to.be( 'this is <span style="color:blue"><span style="font-weight:bold">blue bold</span></span>' ) ;
```

## Escape collection

**Escape.control() should escape control characters**

```javascript
expect( string.escape.control( 'Hello\n\t... world!' ) ).to.be( 'Hello\\n\\t... world!' ) ;
expect( string.escape.control( 'Hello\\n\\t... world!' ) ).to.be( 'Hello\\n\\t... world!' ) ;
expect( string.escape.control( 'Hello\\\n\\\t... world!' ) ).to.be( 'Hello\\\\n\\\\t... world!' ) ;
expect( string.escape.control( 'Hello\\\\n\\\\t... world!' ) ).to.be( 'Hello\\\\n\\\\t... world!' ) ;

expect( string.escape.control( 'Nasty\x00chars\x1bhere\x7f!' ) ).to.be( 'Nasty\\x00chars\\x1bhere\\x7f!' ) ;
```

**Escape.shellArg() should escape a string so that it will be suitable as a shell command's argument**

```javascript
//console.log( 'Shell arg:' , string.escape.shellArg( "Here's my shell's argument" ) ) ;
expect( string.escape.shellArg( "Here's my shell's argument" ) ).to.be( "'Here'\\''s my shell'\\''s argument'" ) ;
```

**Escape.jsSingleQuote() should escape a string so that it will be suitable as a JS string code**

```javascript
expect( string.escape.jsSingleQuote( "A string with 'single' quotes" ) ).to.be( "A string with \\'single\\' quotes" ) ;
expect( string.escape.jsSingleQuote( "A string with 'single' quotes\nand new\nlines" ) ).to.be( "A string with \\'single\\' quotes\\nand new\\nlines" ) ;
```

**Escape.jsDoubleQuote() should escape a string so that it will be suitable as a JS string code**

```javascript
expect( string.escape.jsDoubleQuote( 'A string with "double" quotes' ) ).to.be( 'A string with \\"double\\" quotes' ) ;
expect( string.escape.jsDoubleQuote( 'A string with "double" quotes\nand new\nlines' ) ).to.be( 'A string with \\"double\\" quotes\\nand new\\nlines' ) ;
```

**Escape.regExp() should escape a string so that it will be suitable as a literal string into a regular expression pattern**

```javascript
//console.log( 'String in RegExp:' , string.escape.regExp( "(This) {is} [my] ^$tring^... +doesn't+ *it*? |yes| \\no\\ /maybe/" ) ) ;
expect( string.escape.regExp( "(This) {is} [my] ^$tring^... +doesn't+ *it*? |yes| \\no\\ /maybe/" ) )
	.to.be( "\\(This\\) \\{is\\} \\[my\\] \\^\\$tring\\^\\.\\.\\. \\+doesn't\\+ \\*it\\*\\? \\|yes\\| \\\\no\\\\ \\/maybe\\/" ) ;
```

**Escape.regExpReplacement() should escape a string so that it will be suitable as a literal string into a regular expression replacement**

```javascript
expect( string.escape.regExpReplacement( "$he love$ dollar$ $$$" ) ).to.be( "$$he love$$ dollar$$ $$$$$$" ) ;

expect(
	'$he love$ dollar$ $$$'.replace(
		new RegExp( string.escape.regExp( '$' ) , 'g' ) ,
		string.escape.regExpReplacement( '$1' )
	) 
).to.be( "$1he love$1 dollar$1 $1$1$1" ) ;
```

**Escape.html() should escape a string so that it will be suitable as HTML content**

```javascript
//console.log( string.escape.html( "<This> isn't \"R&D\"" ) ) ;
expect( string.escape.html( "<This> isn't \"R&D\"" ) ).to.be( "&lt;This&gt; isn't \"R&amp;D\"" ) ;
```

**Escape.htmlAttr() should escape a string so that it will be suitable as an HTML tag attribute's value**

```javascript
//console.log( string.escape.htmlAttr( "<This> isn't \"R&D\"" ) ) ;
expect( string.escape.htmlAttr( "<This> isn't \"R&D\"" ) ).to.be( "&lt;This&gt; isn't &quot;R&amp;D&quot;" ) ;
```

**Escape.htmlSpecialChars() should escape all HTML special characters**

```javascript
//console.log( string.escape.htmlSpecialChars( "<This> isn't \"R&D\"" ) ) ;
expect( string.escape.htmlSpecialChars( "<This> isn't \"R&D\"" ) ).to.be( "&lt;This&gt; isn&#039;t &quot;R&amp;D&quot;" ) ;
```

## Camel case

**.toCamelCase() should transform a string composed of alphanum - minus - underscore to a camelCase string**

```javascript
expect( string.toCamelCase( 'one-two-three' ) ).to.be( 'oneTwoThree' ) ;
expect( string.toCamelCase( 'one_two_three' ) ).to.be( 'oneTwoThree' ) ;
expect( string.toCamelCase( 'OnE-tWo_tHree' ) ).to.be( 'oneTwoThree' ) ;
expect( string.toCamelCase( 'ONE-TWO-THREE' ) ).to.be( 'oneTwoThree' ) ;
expect( string.toCamelCase( 'a-b-c' ) ).to.be( 'aBC' ) ;
```

**.toCamelCase() edge cases**

```javascript
expect( string.toCamelCase( '' ) ).to.be( '' ) ;
expect( string.toCamelCase() ).to.be( '' ) ;
expect( string.toCamelCase( 'u' ) ).to.be( 'u' ) ;
expect( string.toCamelCase( 'U' ) ).to.be( 'u' ) ;
expect( string.toCamelCase( 'U-b' ) ).to.be( 'uB' ) ;
expect( string.toCamelCase( 'U-' ) ).to.be( 'u' ) ;
expect( string.toCamelCase( '-U' ) ).to.be( 'u' ) ;
```

**.camelCaseToDashed() should transform a string composed of alphanum - minus - underscore to a camelCase string**

```javascript
expect( string.camelCaseToDashed( 'oneTwoThree' ) ).to.be( 'one-two-three' ) ;
expect( string.camelCaseToDashed( 'OneTwoThree' ) ).to.be( 'one-two-three' ) ;
expect( string.camelCaseToDashed( 'aBC' ) ).to.be( 'a-b-c' ) ;
```

## Latinize

**.latinize() should transform to regular latin letters without any accent**

```javascript
expect( string.latinize( 'éàèùâêîôûÂÊÎÔÛäëïöüÄËÏÖÜæÆŧøþßðđħł' ) )
                 .to.be( 'eaeuaeiouAEIOUaeiouAEIOUaeAEtothssdhdhl' ) ;
```

## Wordwrap

**.wordwrap() should wrap words**

```javascript
expect( string.wordwrap( 'one two three four five six seven' , 10 ) ).to.be( 'one two\nthree\nfour five\nsix seven' ) ;
expect( string.wordwrap( 'one two three four five six seven' , 10 , '<br />\n' ) ).to.be( 'one two<br />\nthree<br />\nfour five<br />\nsix seven' ) ;
expect( string.wordwrap( 'one two three four five six seven' , 10 , null ) ).to.eql( [ 'one two' , 'three' , 'four five' , 'six seven' ] ) ;
expect( string.wordwrap( 'one\ntwo three four five six seven' , 10 ) ).to.be( 'one\ntwo three\nfour five\nsix seven' ) ;
expect( string.wordwrap( '   one\ntwo three four five six seven' , 10 ) ).to.be( 'one\ntwo three\nfour five\nsix seven' ) ;
expect( string.wordwrap( '   one        \ntwo three four five six seven' , 10 ) ).to.be( 'one\ntwo three\nfour five\nsix seven' ) ;
```

**.wordwrap() and surrogate pairs**

```javascript
expect( string.wordwrap( '𝌆𝌆𝌆 𝌆𝌆𝌆 𝌆𝌆𝌆𝌆𝌆 𝌆𝌆𝌆𝌆 𝌆𝌆𝌆𝌆 𝌆𝌆𝌆 𝌆𝌆𝌆𝌆𝌆' , 10 ) ).to.be( '𝌆𝌆𝌆 𝌆𝌆𝌆\n𝌆𝌆𝌆𝌆𝌆\n𝌆𝌆𝌆𝌆 𝌆𝌆𝌆𝌆\n𝌆𝌆𝌆 𝌆𝌆𝌆𝌆𝌆' ) ;
```

**.wordwrap() and fullwidth chars**

```javascript
expect( string.wordwrap( '備備 備備備 備備備備 備備' , 10 ) ).to.be( '備備\n備備備\n備備備備\n備備' ) ;
expect( string.wordwrap( '備備 備備 備 備備備備 備備' , 10 ) ).to.be( '備備 備備\n備\n備備備備\n備備' ) ;
expect( string.wordwrap( '備備 備備 備 備 備 備備 備備備' , 10 ) ).to.be( '備備 備備\n備 備 備\n備備\n備備備' ) ;
```

**.wordwrap() and french typography rules with '!', '?', ':' and ';'**

```javascript
expect( string.wordwrap( 'un ! deux ? trois : quatre ; cinq !' , 10 ) ).to.be( 'un !\ndeux ?\ntrois :\nquatre ;\ncinq !' ) ;
```

## inspect()

**Should inspect a variable with default options accordingly**

```javascript
var MyClass = function MyClass() {
	this.variable = 1 ;
} ;

MyClass.prototype.report = function report() { console.log( 'Variable value:' , this.variable ) ; } ;
MyClass.staticFunc = function staticFunc() { console.log( 'Static function.' ) ; } ;

var sparseArray = [] ;
sparseArray[ 3 ] = 'three' ;
sparseArray[ 10 ] = 'ten' ;
sparseArray[ 20 ] = 'twenty' ;
sparseArray.customProperty = 'customProperty' ;

var object = {
	a: 'A' ,
	b: 2 ,
	str: 'Woot\nWoot\rWoot\tWoot' ,
	sub: {
		u: undefined ,
		n: null ,
		t: true ,
		f: false
	} ,
	emptyString: '' ,
	emptyObject: {} ,
	list: [ 'one','two','three' ] ,
	emptyList: [] ,
	sparseArray: sparseArray ,
	hello: function hello() { console.log( 'Hello!' ) ; } ,
	anonymous: function() { console.log( 'anonymous...' ) ; } ,
	class: MyClass ,
	instance: new MyClass() ,
	buf: new Buffer( 'This is a buffer!' )
} ;

object.sub.circular = object ;

Object.defineProperties( object , {
	c: { value: '3' } ,
	d: {
		get: function() { throw new Error( 'Should not be called by the test' ) ; } ,
		set: function( value ) {}
	}
} ) ;

//console.log( '>>>>>' , string.escape.control( string.inspect( object ) ) ) ;
//console.log( string.inspect( { style: 'color' } , object ) ) ;
var actual = string.inspect( object ) ;
var expected = '<Object> <object> {\n    a: "A" <string>(1)\n    b: 2 <number>\n    str: "Woot\\nWoot\\rWoot\\tWoot" <string>(19)\n    sub: <Object> <object> {\n        u: undefined\n        n: null\n        t: true\n        f: false\n        circular: <Object> <object> [circular]\n    }\n    emptyString: "" <string>(0)\n    emptyObject: <Object> <object> {}\n    list: <Array>(3) <object> {\n        [0] "one" <string>(3)\n        [1] "two" <string>(3)\n        [2] "three" <string>(5)\n        length: 3 <number> <-conf -enum>\n    }\n    emptyList: <Array>(0) <object> {\n        length: 0 <number> <-conf -enum>\n    }\n    sparseArray: <Array>(21) <object> {\n        [3] "three" <string>(5)\n        [10] "ten" <string>(3)\n        [20] "twenty" <string>(6)\n        length: 21 <number> <-conf -enum>\n        customProperty: "customProperty" <string>(14)\n    }\n    hello: <Function> hello(0) <function>\n    anonymous: <Function> anonymous(0) <function>\n    class: <Function> MyClass(0) <function>\n    instance: <MyClass> <object> {\n        variable: 1 <number>\n    }\n    buf: <Buffer 54 68 69 73 20 69 73 20 61 20 62 75 66 66 65 72 21> <Buffer>(17)\n    c: "3" <string>(1) <-conf -enum -w>\n    d: <getter/setter> {\n        get: <Function> get(0) <function>\n        set: <Function> set(1) <function>\n    }\n}\n' ;
//console.log( '\n' + expected + '\n\n' + actual + '\n\n' ) ;
expect( actual ).to.be( expected ) ;
//console.log( string.inspect( { style: 'color' } , object ) ) ;
```

**Should pass the Array circular references bug**

```javascript
var array = [ [ 1 ] ] ;
expect( string.inspect( array ) ).to.be( '<Array>(1) <object> {\n    [0] <Array>(1) <object> {\n        [0] 1 <number>\n        length: 1 <number> <-conf -enum>\n    }\n    length: 1 <number> <-conf -enum>\n}\n' ) ;
```

**Should inspect object with no constructor**

```javascript
expect( string.inspect( Object.assign( Object.create( null ) , { a: 1, b: 2 } ) ) ).to.be( '<(no constructor)> <object> {\n    a: 1 <number>\n    b: 2 <number>\n}\n' ) ;
```

## Title case

**Basic .toTitleCase() usages**

```javascript
expect( string.toTitleCase( 'bob bill booo électron hétérogénéité ALLCAPS McDowell jean-michel' ) )
	.to.be( 'Bob Bill Booo Électron Hétérogénéité ALLCAPS McDowell Jean-Michel' ) ;
expect( string.toTitleCase( 'bob bill booo électron hétérogénéité ALLCAPS McDowell jean-michel' , { zealous: true } ) )
	.to.be( 'Bob Bill Booo Électron Hétérogénéité Allcaps Mcdowell Jean-Michel' ) ;
expect( string.toTitleCase( 'bob bill booo électron hétérogénéité ALLCAPS McDowell jean-michel' , { zealous: true , preserveAllCaps: true } ) )
	.to.be( 'Bob Bill Booo Électron Hétérogénéité ALLCAPS Mcdowell Jean-Michel' ) ;
```

## Misc

**.resize()**

```javascript
expect( string.resize( 'bobby' , 3 ) ).to.be( 'bob' ) ;
expect( string.resize( 'bobby' , 5 ) ).to.be( 'bobby' ) ;
expect( string.resize( 'bobby' , 8 ) ).to.be( 'bobby   ' ) ;
```

**.occurenceCount()**

```javascript
expect( string.occurenceCount( '' , '' ) ).to.be( 0 ) ;
expect( string.occurenceCount( 'three' , '' ) ).to.be( 0 ) ;
expect( string.occurenceCount( '' , 'o' ) ).to.be( 0 ) ;
expect( string.occurenceCount( '' , 'omg' ) ).to.be( 0 ) ;
expect( string.occurenceCount( 'three' , 'o' ) ).to.be( 0 ) ;
expect( string.occurenceCount( 'o' , 'o' ) ).to.be( 1 ) ;
expect( string.occurenceCount( 'ooo' , 'o' ) ).to.be( 3 ) ;
expect( string.occurenceCount( 'ooo' , 'oo' ) ).to.be( 1 ) ;
expect( string.occurenceCount( 'aooo' , 'oo' ) ).to.be( 1 ) ;
expect( string.occurenceCount( 'aoooo' , 'oo' ) ).to.be( 2 ) ;
expect( string.occurenceCount( 'one two three four' , 'o' ) ).to.be( 3 ) ;
expect( string.occurenceCount( 'one one one' , 'one' ) ).to.be( 3 ) ;
expect( string.occurenceCount( 'oneoneone' , 'one' ) ).to.be( 3 ) ;
```

## Unicode

**Unicode.length() should report correctly the length of a string**

```javascript
expect( string.unicode.length( '' ) ).to.be( 0 ) ;
expect( string.unicode.length( 'a' ) ).to.be( 1 ) ;
expect( string.unicode.length( 'abc' ) ).to.be( 3 ) ;
expect( string.unicode.length( '\x1b[' ) ).to.be( 2 ) ;
expect( string.unicode.length( '𝌆' ) ).to.be( 1 ) ;
expect( string.unicode.length( 'a𝌆' ) ).to.be( 2 ) ;
expect( string.unicode.length( 'a𝌆a𝌆a' ) ).to.be( 5 ) ;
expect( string.unicode.length( 'é𝌆é𝌆é' ) ).to.be( 5 ) ;
expect( string.unicode.length( '䷆䷆' ) ).to.be( 2 ) ;
expect( string.unicode.length( '備' ) ).to.be( 1 ) ;
expect( string.unicode.length( '備備' ) ).to.be( 2 ) ;
expect( string.unicode.length( '備-備' ) ).to.be( 3 ) ;
```

**Unicode.toArray() should produce an array of character**

```javascript
expect( string.unicode.toArray( '' ) ).to.eql( [] ) ;
expect( string.unicode.toArray( 'a' ) ).to.eql( [ 'a' ] ) ;
expect( string.unicode.toArray( 'abc' ) ).to.eql( [ 'a' , 'b' , 'c' ] ) ;
expect( string.unicode.toArray( '\x1b[' ) ).to.eql( [ '\x1b' , '[' ] ) ;
expect( string.unicode.toArray( '𝌆' ) ).to.eql( [ '𝌆' ] ) ;
expect( string.unicode.toArray( 'a𝌆' ) ).to.eql( [ 'a' , '𝌆' ] ) ;
expect( string.unicode.toArray( 'a𝌆a𝌆a' ) ).to.eql( [ 'a' , '𝌆' , 'a' , '𝌆' , 'a' ] ) ;
expect( string.unicode.toArray( 'é𝌆é𝌆é' ) ).to.eql( [ 'é' , '𝌆' , 'é' , '𝌆' , 'é' ] ) ;
expect( string.unicode.toArray( '䷆䷆' ) ).to.eql( [ '䷆' , '䷆' ] ) ;
expect( string.unicode.toArray( '備' ) ).to.eql( [ '備' ] ) ;
expect( string.unicode.toArray( '備備' ) ).to.eql( [ '備' , '備' ] ) ;
expect( string.unicode.toArray( '備-備' ) ).to.eql( [ '備' , '-' , '備' ] ) ;
```

**Unicode.surrogatePair() should return 0 for single char, 1 for leading surrogate, -1 for trailing surrogate**

```javascript
expect( string.unicode.surrogatePair( 'a' ) ).to.be( 0 ) ;
expect( '𝌆'.length ).to.be( 2 ) ;
expect( string.unicode.surrogatePair( '𝌆'[0] ) ).to.be( 1 ) ;
expect( string.unicode.surrogatePair( '𝌆'[1] ) ).to.be( -1 ) ;
expect( '備'.length ).to.be( 2 ) ;
expect( string.unicode.surrogatePair( '備'[0] ) ).to.be( 1 ) ;
expect( string.unicode.surrogatePair( '備'[1] ) ).to.be( -1 ) ;

// Can be wide or not, but expressed in only 1 code unit
expect( '䷆'.length ).to.be( 1 ) ;
expect( string.unicode.surrogatePair( '䷆'[0] ) ).to.be( 0 ) ;
//		expect( string.unicode.surrogatePair( '䷆'[1] ) ).to.be( undefined ) ;
```

**Unicode.isFullWidth() should return true if the char is full-width**

```javascript
expect( string.unicode.isFullWidth( 'a' ) ).to.be( false ) ;
expect( string.unicode.isFullWidth( '＠' ) ).to.be( true ) ;
expect( string.unicode.isFullWidth( '𝌆' ) ).to.be( false ) ;
expect( string.unicode.isFullWidth( '備' ) ).to.be( true ) ;
expect( string.unicode.isFullWidth( '䷆' ) ).to.be( false ) ;
```

**.toFullWidth() should transform a character to its full-width variant, if it exist**

```javascript
expect( string.unicode.toFullWidth( '@' ) ).to.be( '＠' ) ;
expect( string.unicode.toFullWidth( 'é' ) ).to.be( 'é' ) ;
```

**.width() should return the width of a string when displayed on a terminal or a monospace font**

```javascript
expect( string.unicode.width( 'aé@à' ) ).to.be( 4 ) ;
expect( string.unicode.width( 'aé＠à' ) ).to.be( 5 ) ;
```


