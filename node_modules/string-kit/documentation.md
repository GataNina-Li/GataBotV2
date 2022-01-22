

# String Kit

A string manipulation toolbox, featuring a string formatter (inspired by sprintf), a variable inspector
(output featuring ANSI colors and HTML) and various escape functions (shell argument, regexp, html, etc).

* License: MIT
* Current status: beta
* Platform: Node.js only (browser support is planned)



# Install

Use Node Package Manager:

    npm install string-kit



# Reference

* [.format()](#ref.format)
* [.format.count()](#ref.format.count)
* [.inspect()](#ref.inspect)
* Escape functions collection
	* [.escape.shellArg()](#ref.escape.shellArg)
	* [.escape.regExp()](#ref.escape.regExp)
	* [.escape.regExpPattern()](#ref.escape.regExp)
	* [.escape.regExpReplacement()](#ref.escape.regExpReplacement)
	* [.escape.html()](#ref.escape.html)
	* [.escape.htmlAttr()](#ref.escape.htmlAttr)
	* [.escape.htmlSpecialChars()](#ref.escape.htmlSpecialChars)
	* [.escape.control()](#ref.escape.control)



<a name="ref.format"></a>
### .format( formatString , ... )

* formatString `String` a string containing some `sprintf()`-like formating
* ... `mixed` a variable list of arguments to insert into the formatString

This function is inspired by the `C`'s `sprintf()` function.

Basicly, if `formatString` includes *format specifiers* (subsequences beginning with %), the additional arguments
following `formatString` are formatted and inserted in the resulting string replacing their respective specifiers.

Also it diverges from `C` in quite a few places.

**New:** Since *v0.3.x* we can add styles markup (color, bold, italic, and so on...) using the `^` caret.
See [the format markup documentation](#ref.format.markup).

Basic usage:
```js
var format = require( 'string-kit' ).format ;
console.log( format( 'Hello %s %s, how are you?' , 'Joe' , 'Doe' ) ) ;
// Output: 'Hello Joe Doe, how are you?'
```

Specifiers:
* `%%` write a single %
* `%s` to string, with sanitizer
* `%S` to string, with `^` interpretation
* `%r` to raw string, without any sanitizer
* `%n` to natural: output the most natural representation for this type
* `%N` to even more natural: avoid type hinting marks like bracket for array
* `%f` to (float) number
* `%k` to number with metric system prefixes (like k, M, G, and so on...)
* `%e` to exponential “E notation” (e.g. 13 -> 1.23e+2)
* `%K` to scientific notation (e.g. 123 -> 1.23 × 10²)
* `%i` to integer
* `%d` alias of `%i` (*C*'s `printf()` compatibility)
* `%u` to unsigned integer
* `%U` to unsigned positive integer (>0)
* `%P` to (absolute) percent (e.g.: 1.25 -> 125% ; 0.75 -> 75%)
* `%p` to relative percent (e.g.: 1.25 -> +25% ; 0.75 -> -25%)
* `%t` to time duration, convert ms into H:min:s
* `%m` to degrees/minutes/seconds notation
* `%h` to unsigned hexadecimal
* `%x` to unsigned hexadecimal, force pairs of symbols (e.g. 'f' -> '0f')
* `%o` to unsigned octal
* `%b` to unsigned binary
* `%X` string/binary/buffer to hexadecimal: convert a string into hex charcodes, force pair of symbols (e.g. 'f' -> '0f' ; 'hello' -> '68656c6c6f')
* `%z` string/binary/buffer to base64
* `%Z` string/binary/buffer to base64url
* `%O` for objects (call string-kit's inspect() with ultra-minimal options)
* `%I` call string-kit's inspect()
* `%Y` call string-kit's inspect(), but do not inspect non-enumerable
* `%E` call string-kit's inspectError()
* `%J` to JSON (call JSON.stringify()
* `%D` drop, the argument does not produce anything but is eaten anyway
* `%F` filter function existing in the *this* context, e.g. %[filter:%a%a]F
* `%a` argument for a filter function

Few examples:
```js
var format = require( 'string-kit' ).format ;

console.log( format( 'This company regains %d%% of market share.' , 36 ) ) ;
// Output: 'This company regains 36% of market share.'

console.log( format( '11/8=%f' , 11/8 ) ) ;
// Output: '11/8=1.375'

console.log( format( 'Hexa %h %x' , 11 , 11 ) ) ;
// Output: 'Hexa b 0b'
```

We can insert a number between the *%* sign and the letter of the specifier, this way, rather than using the next
argument, it uses the *Nth* argument, this is the absolute position:
```js
console.log( format( '%2s%1s%3s' , 'A' , 'B' , 'C' ) ) ; // 'BAC'
```

Also, the internal pointer is moved anyway, so the *Nth* format specifier still use the *Nth* argument if it doesn't
specify any position:
```js
console.log( format( '%2s%s%s' , 'A' , 'B' , 'C' ) ) ; // 'BBC'
```

If the number is preceded by a *plus* or a *minus* sign, the relative position is used rather than the absolute position.
```js
console.log( format( '%+1s%-1s%s' , 'A' , 'B' , 'C' ) ) ; // 'BAC'
```

Use case: language.
```js
var hello = {
	en: 'Hello %s %s!' ,
	jp: 'Konnichiwa %2s %1s!'
} ;

console.log( format( hello[ lang ] , firstName , lastName ) ) ;
// Output the appropriate greeting in a language.
// In japanese the last name will come before the first name,
// but the argument list doesn't need to be changed.
```

**Some specifiers accept parameters:** there are between bracket, inserted before the letter, e.g.: `%[L5]s`.
[See the specifier parameters section.](#ref.format.parameters)

The mysterious `%[]F` format specifier is used when we want custom formatter.
Firstly we need to build an object containing one or many functions.
Then, `format()` should be used with `call()`, to pass the functions collection as the *this* context.

The `%[` is followed by the function's name, followed by a `:`, followed by a variable list of arguments using `%a`.
It is still possible to use relative and absolute positionning.
The whole *format specifier* is finished when a `]F` is encountered.

Example:
```js
var filters = {
	fxy: function( a , b ) { return '' + ( a * a + b ) ; }
} ;

console.log( format.call( filters , '%s%[fxy:%a%a]F' , 'f(x,y)=' , 5 , 3 ) ) ;
// Output: 'f(x,y)=28'

console.log( format.call( filters , '%s%[fxy:%+1a%-1a]F' , 'f(x,y)=' , 5 , 3 ) ) ;
// Output: 'f(x,y)=14'
```



<a name="ref.format.parameters"></a>
##### Specifiers parameters

A parameter consists in a letter, then one character (letter or not letter), that could be followed by any number of non-letter characters.
E.g. `%[L5]s`, the *L* parameter that produce left-padding to force a *5* characters-length.

A special parameter (specific for that *specifier*) consists in any number of non-letter characters and must be the first parameter.
E.g.:
* `%[.2]f`, the special parameter for the *f* specifier (float), it rounds the number to the second decimal place.
* `%[.2L5]f`, mixing both the special and normal parameters, the special parameter comes first (round the the second decimal place),
  then comes the generic and normal parameter *L* (left-padding)

When a parameter needs a boolean, `+` denotes true, while `-` denotes false.

Generic parameters -- they almost always exists for any specifier and use an upper-case parameter letter:
* L *integer*: it produces left-padding (using space) and force the length to the value
* R *integer*: same than *L* but produce right-padding instead

*Specifier's* specific parameters :
* %f %e %K %k %p %P:
	* *integer*: the number precision in *digits*, e.g. `%[3]f` (12.345 -> 12.3)
	* *integer* .: rounds to this integer place, e.g. `%[3.]f` (12345 -> 12000)
	* . *integer*: rounds to this decimal place, e.g. `%[.2]f` (1.2345 -> 1.23)
	* . *integer* !: rounds to this decimal place and force displaying 0 up to this decimal place,
	  e.g. `%[.2!]f` (12.9 -> 12.90 ; 12 -> 12.00) (useful for prices)
	* . *integer* ?: rounds to this decimal place and force displaying 0 up to this decimal place **if** there is at least one non-zero in the decimal part,
	  e.g. `%[.2?]f` (12.9 -> 12.90 ; 12 -> 12)
	* z *integer*: it produces zero padding for the integer part forcing at least *integer* digits, e.g. `%[z5]f` (12 -> 00012)
	* g *char*: set a group separator character for thousands, e.g. `%[g,]f` (123456 -> 12,345)
	* g: use the default group separator for thousands, e.g. `%[g]f` (123456 -> 12 345)
* %O %I %Y %E:
	* *integer*: the depth of nested object inspection
	* c *boolean*: if true, can use ANSI color, if false, it will not use colors. E.g. `%[c+]I`.



<a name="ref.format.markup"></a>
##### Style markup reference

Since *v0.3.x* we can add styles (color, bold, italic, and so on...) using the `^` caret:
```js
var format = require( 'string-kit' ).format ;
console.log( format( 'This is ^rred^ and ^bblue^:!' , 'Joe' , 'Doe' ) ) ;
// Output: 'This is red and blue!' with 'red' written in red and 'blue' written in blue.
```

Style markup:
* `^^` write a single caret `^`
* `^b` switch to blue
* `^B` switch to bright blue
* `^c` switch to cyan
* `^C` switch to bright cyan
* `^g` switch to green
* `^G` switch to bright green
* `^k` switch to black
* `^K` switch to bright black
* `^m` switch to magenta
* `^M` switch to bright magenta
* `^r` switch to red
* `^R` switch to bright red
* `^w` switch to white
* `^W` switch to bright white
* `^y` switch to yellow (i.e. brown or orange)
* `^Y` switch to bright yellow (i.e. yellow)
* `^_` switch to underline
* `^/` switch to italic
* `^!` switch to inverse (inverse background and foreground color)
* `^+` switch to bold
* `^-` switch to dim
* `^:` reset the style
* `^ ` (caret followed by a space) reset the style and write a single space
* `^#` background modifier: next color will be a background color instead of a foreground color,
  e.g.: `'Some ^#^r^bred background` text' will write *red background* in blue over red.

**Note:** as soon as the format string has **one** style markup, a style reset will be added at the end of the string.



<a name="ref.format.count"></a>
### .format.count( formatString )

* formatString `String` a string containing some `sprintf()`-like formating

It just counts the number of *format specifier* in the `formatString`.



<a name="ref.inspect"></a>
### .inspect( [options] , variable )

* options `Object` display options, the following key are possible:
	* style `String` this is the style to use, the value can be:
		* 'none': (default) normal output suitable for console.log() or writing into a file
		* 'inline': like 'none', but without newlines
		* 'color': colorful output suitable for terminal
		* 'html': html output
	* depth: depth limit, default: 3
	* maxLength: length limit for strings, default: 250
	* outputMaxLength:  length limit for the inspect output string, default: 5000
	* noFunc: do not display functions
	* noDescriptor: do not display descriptor information
	* noArrayProperty: do not display array properties
	* noType: do not display type and constructor
	* enumOnly: only display enumerable properties
	* funcDetails: display function's details
	* proto: display object's prototype
	* sort: sort the keys
	* minimal: imply noFunc: true, noDescriptor: true, noType: true, enumOnly: true, proto: false and funcDetails: false.
	  Display a minimal JSON-like output.
	* protoBlackList: `Set` of blacklisted object prototype (will not recurse inside it)
	* propertyBlackList: `Set` of blacklisted property names (will not even display it)
	* useInspect: use .inspect() method when available on an object (default to false)
* variable `mixed` anything we want to inspect/debug

It inspect a variable, and return a string ready to be displayed with console.log(), or even as HTML output.

It produces a slightly better output than node's `util.inspect()`, with more options to control what should be displayed.

Since `options` come first, it is possible to use `bind()` to create some custom variable inspector.

For example:
```js
var colorInspect = require( 'string-kit' ).inspect.bind( undefined , { style: 'color' } ) ;
```



## Escape functions collection



<a name="ref.escape.shellArg"></a>
### .escape.shellArg( str )

* str `String` the string to filter

It escapes the string so that it will be suitable as a shell command's argument.



<a name="ref.escape.regExp"></a>
### .escape.regExp( str ) , .escape.regExpPattern( str ) 

* str `String` the string to filter

It escapes the string so that it will be suitable to inject it in a regular expression's pattern as a literal string.

Example of a search and replace from a user's input:
```js
var result = data.replace(
	new RegExp( stringKit.escape.regExp( userInputSearch ) , 'g' ) ,
	stringKit.escape.regExpReplacement( userInputReplace )
) ;
```



<a name="ref.escape.regExpReplacement"></a>
### .escape.regExpReplacement( str )

* str `String` the string to filter

It escapes the string so that it will be suitable as a literal string for a regular expression's replacement.



<a name="ref.escape.html"></a>
### .escape.html( str )

* str `String` the string to filter

It escapes the string so that it will be suitable as HTML content.

Only  `< > &` are replaced by HTML entities.



<a name="ref.escape.htmlAttr"></a>
### .escape.htmlAttr( str )

* str `String` the string to filter

It escapes the string so that it will be suitable as an HTML tag attribute's value.

Only  `< > & "` are replaced by HTML entities.

It assumes valid HTML: the attribute's value should be into double quote, not in single quote.



<a name="ref.escape.htmlSpecialChars"></a>
### .escape.htmlSpecialChars( str )

* str `String` the string to filter

It escapes all HTML special characters, `< > & " '` are replaced by HTML entities.



<a name="ref.escape.control"></a>
### .escape.control( str )

* str `String` the string to filter

It escapes all ASCII control characters (code lesser than or equals to 0x1F, or *backspace*).

*Carriage return*, *newline* and *tabulation* are respectively replaced by `\r`, `\n` and `\t`.
Other characters are replaced by the unicode notation, e.g. `NUL` is replaced by `\x00`.





Full BDD spec generated by Mocha:


