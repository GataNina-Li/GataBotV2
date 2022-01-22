const fetch = require('node-fetch')
const FormData = require('form-data')
const { fromBuffer } = require('file-type')
const fs = require('fs')
const ra = require('ra-api')
/**
 * Upload epheremal file to file.io
 * `Expired in 1 day`
 * `100MB Max Filesize`
 * @param {Buffer} buffer File Buffer
 */
module.exports = async buffer => {
  const { ext } = await fromBuffer(buffer) || {}
  fs.writeFileSync('upload.' + ext, buffer)
  kk = await ra.UploadFile('upload.' + ext)
  fs.unlinkSync('upload.' + ext)
  return kk.result.namaFile
  }