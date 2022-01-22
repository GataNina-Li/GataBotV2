# Warn
## A JSHint configuration tool.
[![Build Status](https://secure.travis-ci.org/fivetanley/warn.js.png)](http://travis-ci.org/fivetanley/warn.js)

**NOTE: This project is not being actively maintained. It is not up to
date with all the JSHint options. I had no idea people were still using
this and found it useful. If you are interested in maintaining the
project, open an issue or ping me on twitter (@fivetanley). Thanks!**

**Warn** makes it easy to create and reuse [JSHint](https://github.com/jshint/node-jshint) configuration files.  You can even toggle settings on the fly.

`Warn.js` can generate *predefined globals* ( so JSHint won't yell at you because you're using them because they haven't been defined yet) for the following projects:

  1. Agility
  2. Angular
  3. Backbone
  4. Ember
  5. Ext.js
  6. Knockout
  7. Knockback
  8. RequireJS
  9. Spine.js
  10. Underscore
  11. YUI

`Warn` also supports the following test suite's globals:

  1. Buster
  2. Chai (TDD and BDD style )
  3. Expect.js
  4. Hiro
  5. Jasmine
  6. Mocha (All styles / interfaces)
  7. QUnit
  8. Sinon
  9. Vows

First, install JSHint if you haven't so already:

`npm install -g jshint`

The `-g` flag installs jshint globally so you can use it as a command line tool.  ( *Note: You might need to use sudo!* )

Last, install `warn.js`:

`npm install -g warn`

## Usage guide

```
Usage: warn.js [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -l, --load <file>      Load a JSHint json configuration file
    -o, --output <file>    Specify the output file to save new configuration file. Default [.jshintrc]
    -e, --enable <items>   Enable options or predefined globals ( like browser, node, jquery, backbone)
    -d, --disable <items>  Disable options or predefined globals ( like browser, node, jquery, backbone)
    -m, --maxerr <number>  Set the number of maximum errors for JSHint to report before quitting.
    -i, --indent           Specify indentation
```
### Reading / Writing configuration files

You can `load` in a previous config (but only if it's `JSON` format) using the `--load -l` flag.  `Warn` will use those values before enabling/disabling settings.

If there is a `.jshintrc` file in the current working directory, `Warn` will load it automatically.

Use the `--output -o` option to tell Warn.js where to write the configuration file.  If `-o` is not passed to `Warn`, then the configuration will be written to `.jshintrc` in the current working directory.


### Configuring JSHint options

Most of the values `JSHint` reads in are `Boolean` values ( `true`/`false` ), so use `--enable -e` or `--disable -d` accordingly:

`warn.js --enable backbone`

`Warn` will automatically enable globals for projects that require other projects globals ( for instance, `Backbone` requires `Underscore`'s `_` and `jQuery`'s `$` ).  **NOTE**: If `JSHint` already has a predefined global, Warn.js will enable/disable that one (e.g. `jquery` ).

If you want to enable/disable more than one option, **use commas**:

`warn.js --enable jquery,backbone,ember,etc`

If Warn.js doesn't recognize a set of predefined globals passed to `--enable` or `--disable`, it will add the word to your config automatically.

**NOTE** : `Warn` will enable options, *then* disable them.  Disable always wins.

Some values are `Number`s, and they have their own options:

`warn.js --maxerr <maximum # of errors before jshint will stop reporting>`

`warn.js --indent <number of spaces used for indentation>`

The rest of the things you can enable/disable are `Boolean` values, and affect how `JSHint` analyzes your code (like requiring you to use `hasOwnProperty` in a `for in` loop).

## FAQ

### How do I get my favorite project's globals in Warn?

Simply fork this repository, and add your definition to `lib/CustomPredefs.js'.  The format is like so:

```
myproject = [ 'foo', 'bar', 'baz' ], // Use if project doesn't import other project's globals
myproject2 = {
	deps: [ 'foo' ], // list Array of dependencies here.
	dict: [ 'myGlobal' ] // adds a list of words that JSHint will ignore
}
```

**Make sure the tests still pass!**

`grunt build`

### What are the name of the options I can enable and disable?

The below settings are taken from the [node-jshint](https://github.com/jshint/jshint-node/) project and will work when passed to `--enable` or `--disable`.

```
// Defaults as of jshint edition 2011-04-16

{
    // If the scan should stop on first error.
    "passfail": false,
    // Maximum errors before stopping.
    "maxerr": 50,


    // Predefined globals

    // If the standard browser globals should be predefined.
    "browser": false,
    // If the Node.js environment globals should be predefined.
    "node": false,
    // If the Rhino environment globals should be predefined.
    "rhino": false,
    // If CouchDB globals should be predefined.
    "couch": false,
    // If the Windows Scripting Host environment globals should be predefined.
    "wsh": false,

    // If jQuery globals should be predefined.
    "jquery": false,
    // If Prototype and Scriptaculous globals should be predefined.
    "prototypejs": false,
    // If MooTools globals should be predefined.
    "mootools": false,
    // If Dojo Toolkit globals should be predefined.
    "dojo": false,

    // Custom predefined globals.
    "predef": [],


    // Development

    // If debugger statements should be allowed.
    "debug": false,
    // If logging globals should be predefined (console, alert, etc.).
    "devel": false,


    // ECMAScript 5

    // If ES5 syntax should be allowed.
    "es5": false,
    // Require the "use strict"; pragma.
    "strict": false,
    // If global "use strict"; should be allowed (also enables strict).
    "globalstrict": false,


    // The Good Parts

    // If automatic semicolon insertion should be tolerated.
    "asi": false,
    // If line breaks should not be checked, e.g. `return [\n] x`.
    "laxbreak": false,
    // If bitwise operators (&, |, ^, etc.) should not be allowed.
    "bitwise": false,
    // If assignments inside if, for and while should be allowed. Usually
    // conditions and loops are for comparison, not assignments.
    "boss": false,
    // If curly braces around all blocks should be required.
    "curly": false,
    // If === should be required.
    "eqeqeq": false,
    // If == null comparisons should be tolerated.
    "eqnull": false,
    // If eval should be allowed.
    "evil": false,
    // If ExpressionStatement should be allowed as Programs.
    "expr": false,
    // If `for in` loops must filter with `hasOwnPrototype`.
    "forin": false,
    // If immediate invocations must be wrapped in parens, e.g.
    // `( function(){}() );`.
    "immed": false,
    // If use before define should not be tolerated.
    "latedef": false,
    // If functions should be allowed to be defined within loops.
    "loopfunc": false,
    // If arguments.caller and arguments.callee should be disallowed.
    "noarg": false,
    // If the . should not be allowed in regexp literals.
    "regexp": false,
    // If unescaped first/last dash (-) inside brackets should be tolerated.
    "regexdash": false,
    // If script-targeted URLs should be tolerated.
    "scripturl": false,
    // If variable shadowing should be tolerated.
    "shadow": false,
    // If `new function () { ... };` and `new Object;` should be tolerated.
    "supernew": false,
    // If variables should be declared before used.
    "undef": false,
    // If `this` inside a non-constructor function is valid.
    "validthis": false,
    // If smarttabs should be tolerated
    // (http://www.emacswiki.org/emacs/SmartTabs).
    "smarttabs": false,
    // If the `__proto__` property should be allowed.
    "proto": false,
    // If one case switch statements should be allowed.
    "onecase": false,
    // If non-standard (but widely adopted) globals should be predefined.
    "nonstandard": false,
    // Allow multiline strings.
    "multistr": false,
    // If line breaks should not be checked around commas.
    "laxcomma": false,
    // If semicolons may be ommitted for the trailing statements inside of a
    // one-line blocks.
    "lastsemic": false,
    // If the `__iterator__` property should be allowed.
    "iterator": false,
    // If only function scope should be used for scope tests.
    "funcscope": false,
    // If es.next specific syntax should be allowed.
    "esnext": false,


    // Style preferences

    // If constructor names must be capitalized.
    "newcap": false,
    // If empty blocks should be disallowed.
    "noempty": false,
    // If using `new` for side-effects should be disallowed.
    "nonew": false,
    // If names should be checked for leading or trailing underscores
    // (object._attribute would be disallowed).
    "nomen": false,
    // If only one var statement per function should be allowed.
    "onevar": false,
    // If increment and decrement (`++` and `--`) should not be allowed.
    "plusplus": false,
    // If all forms of subscript notation are tolerated.
    "sub": false,
    // If trailing whitespace rules apply.
    "trailing": false,
    // If strict whitespace rules apply.
    "white": false,
    // Specify indentation.
    "indent": 4
}
```

