const getColors = require('.')

// Give it an SVG filename
const colors = getColors(__dirname + '/australia.svg')

// Or an SVG string
const colors = getColors('<svg...>')

// You'll get back an object with two keys: `fills` and `strokes`

// `fills` is an array of chroma-js objects
colors.fills.map(color => color.hex())
// => ['#FFFFFF', '#123123', '#F0F0F0']

// `strokes` is also an array of chroma-js objects
colors.strokes.map(color => color.hex())
// => ['#FFFFFF', '#123123', '#F0F0F0']

// Crazy stuff...
colors.fills[0].alpha(0.5).css();
// => 'rgb(0,128,128)'

// Pass the `flat` option to get back a single array including
// de-duped fills and strokes together
const colors = getColors('<svg...>', {flat: true})
// => [...]
