# get-rgba-palette

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Gets a palette of prominent colors from a flat array of RGBA pixels.

![img](http://i.imgur.com/arnLlX0.png)

Full example: 

```js
var palette = require('get-rgba-palette')
var pixels = require('get-image-pixels')
var load = require('img')
var baboon = require('baboon-image-uri')

load(baboon, function(err, img) {
    //get flat RGBA pixels array
    var px = pixels(img)

    //get 5 prominent colors from our image
    var colors = palette(px, 5)
})
```

[RequireBin demo](http://requirebin.com/?gist=1f49e56f22fa9caa94d7)

Returns RGB colors in the form of:  

```[ [255, 0, 0], [128, 23, 52], [124, 0, 62], etc.. ]``` 

## Usage

[![NPM](https://nodei.co/npm/get-rgba-palette.png)](https://nodei.co/npm/get-rgba-palette/)

#### `palette(pixels[, count, quality, filter])`

Gets an array of RGB colors from an image (`pixels` is a flat RGBA array). Defaults to a `count` of 5 colors and a `quality` setting of 10. 

`quality` determines the step between each pixel when computing the quantization; higher number means fuzzier quality. Must be > 0.

`filter` allows you to threshold the RGBA values given to the quantize function. It passes `(pixels, index)` -- the flat array and index to the RGBA component. Return true to accept the color, or false to reject.

If not specified, the filter function defaults to:

```js
function filter (pixels, index) {
  // offset 3 --> alpha
  return pixels[index + 3] >= 127
}
```

#### `palette.bins(pixels[, count, quality, filter])`

Instead of returning RGB colors, this returns the "bins" for each computed color. This can give you a very rough overview of the distribution of colours in the image. This is fairly arbitrary as the bin `size` does not always represent the exact number of pixels for that color in the image.

Returns an array of objects:

```js
{
    color: [255, 0, 0],
    size: 12414,
    amount: 0.65
}
```

Where `amount` is a percentage for that bin, normalized from the sum of the sizes in the returned bins.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/get-rgba-palette/blob/master/LICENSE.md) for details.
