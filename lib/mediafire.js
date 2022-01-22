const axios = require('axios')
const cheerio = require('cheerio')

const mediafireDl = async (url) => {
async function getMime(links) {
bufs = await require('node-fetch')(links).then(v => v.buffer())
hsil = await require('file-type').fromBuffer(bufs)
return hsil
}
const res = await axios.get(url) 
const $ = cheerio.load(res.data)
const hasil = []
const link = $('a#downloadButton').attr('href')
const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '')
const seplit = link.split('/')
const nama = seplit[5]
hasil.push({ nama, size, link })
return hasil[0]
}


module.exports = mediafireDl