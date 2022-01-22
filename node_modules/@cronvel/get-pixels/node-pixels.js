'use strict'

var ndarray       = require('ndarray')
var PNG           = require('pngjs').PNG
var jpeg          = require('jpeg-js')
var pack          = require('ndarray-pack')
var GifReader     = require('omggif').GifReader
var Bitmap        = require('node-bitmap')
var fs            = require('fs')
var extname       = require('path').extname

function handlePNG(data, cb) {
  var png = new PNG();
  png.parse(data, function(err, img_data) {
    if(err) {
      cb(err)
      return
    }
    cb(null, ndarray(new Uint8Array(img_data.data),
      [img_data.width|0, img_data.height|0, 4],
      [4, 4*img_data.width|0, 1],
      0))
  })
}

function handleJPEG(data, cb) {
  var jpegData
  try {
    jpegData = jpeg.decode(data)
  }
  catch(e) {
    cb(e)
    return
  }
  if(!jpegData) {
    cb(new Error("Error decoding jpeg"))
    return
  }
  var nshape = [ jpegData.height, jpegData.width, 4 ]
  var result = ndarray(jpegData.data, nshape)
  cb(null, result.transpose(1,0))
}

function handleGIF(data, cb) {
  var reader, nshape, ndata, result
  try {
    reader = new GifReader(data)
  } catch(err) {
    cb(err)
    return
  }
  if(reader.numFrames() > 0) {
    nshape = [reader.numFrames(), reader.height, reader.width, 4]
    ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2] * nshape[3])
    result = ndarray(ndata, nshape)
    try {
      for(var i=0; i<reader.numFrames(); ++i) {
        reader.decodeAndBlitFrameRGBA(i, ndata.subarray(
          result.index(i, 0, 0, 0),
          result.index(i+1, 0, 0, 0)))
      }
    } catch(err) {
      cb(err)
      return
    }
    cb(null, result.transpose(0,2,1))
  } else {
    nshape = [reader.height, reader.width, 4]
    ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2])
    result = ndarray(ndata, nshape)
    try {
      reader.decodeAndBlitFrameRGBA(0, ndata)
    } catch(err) {
      cb(err)
      return
    }
    cb(null, result.transpose(1,0))
  }
}

function handleBMP(data, cb) {
  var bmp = new Bitmap(data)
  try {
    bmp.init()
  } catch(e) {
    cb(e)
    return
  }
  var bmpData = bmp.getData()
  var nshape = [ bmpData.getHeight(), bmpData.getWidth(), 4 ]
  var ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2])
  var result = ndarray(ndata, nshape)
  pack(bmpData, result)
  cb(null, result.transpose(1,0))
}


function doParse(type, data, cb) {
  switch(type) {
    case 'png':
      handlePNG(data, cb)
    break

    case 'jpg':
    case 'jpeg':
      handleJPEG(data, cb)
    break

    case 'gif':
      handleGIF(data, cb)
    break

    case 'bmp':
      handleBMP(data, cb)
    break

    default:
      cb(new Error("Unsupported file type: " + type))
  }
}

module.exports = function getPixels(url, type, cb) {
  if(!cb) {
    cb = type
    type = ''
  }
  if(Buffer.isBuffer(url)) {
    if(!type) {
      cb(new Error('Invalid file type'))
      return
    }
    doParse(type, url, cb)
  } else {
    fs.readFile(url, function(err, data) {
      if(err) {
        cb(err)
        return
      }
      type = type || extname(url).toLowerCase().substr(1)

      if(!type) {
        cb(new Error('Invalid file type'))
        return
      }
      doParse(type, data, cb)
    })
  }
}
