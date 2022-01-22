/* globals describe, it */

const fs = require('fs')
const assert = require('assert')
const getColors = require('..')
const hexy = /^#[0-9a-f]{3,6}$/i

describe('get-svg-colors', function(){

  it('is a function', function() {
    assert.equal(typeof getColors, "function")
  })

  it('accepts a filepath and returns an object', function() {
    var colors = getColors(__dirname + '/fixtures/australia.svg')
    assert(Array.isArray(colors.fills))
    assert(Array.isArray(colors.strokes))
  })

  it('accepts an SVG string as input', function() {
    var colors = getColors(fs.readFileSync(__dirname + '/fixtures/australia.svg', 'utf8'))
    assert(Array.isArray(colors.fills))
    assert(colors.fills.length)
    assert(Array.isArray(colors.strokes))
    assert(colors.strokes.length)
  })

  it('returns chroma-js color objects', function() {
    var colors = getColors(__dirname + '/fixtures/australia.svg')
    assert(colors.strokes[0].hex().match(hexy))
    assert(colors.fills[0].hex().match(hexy))
  })

  it('accepts a `flat` option to return a single array include fill and stroke colors', function() {
    var colors = getColors(__dirname + '/fixtures/australia.svg', {flat: true})
    assert(Array.isArray(colors))
    assert(colors.length)
    assert(colors[0].hex().match(hexy))
  })

  it('extracts inline styles', function() {
    var colors = getColors(__dirname + '/fixtures/inline-styles.svg')
    var fills = colors.fills.map(color => color.hex())
    var strokes = colors.strokes.map(color => color.hex())
    var stops = colors.stops.map(color => color.hex())
    assert(fills.indexOf('#ffcc00') > -1)
    assert(strokes.indexOf('#803300') > -1)
    assert(stops.indexOf('#000000') > -1)
  })

  it('supports radial gradients', function() {
    var colors = getColors(__dirname + '/fixtures/radial-gradient.svg')
    var stops = colors.stops.map(color => color.hex())
    assert(stops.indexOf('#ffffff') > -1)
    assert(stops.indexOf('#fce0e0') > -1)

    var colors = getColors(__dirname + '/fixtures/radial-gradient.svg', {flat: true})
    colors = colors.map(color => color.hex())
    assert(colors.indexOf('#ffffff') > -1)
    assert(colors.indexOf('#fce0e0') > -1)
  })

})
