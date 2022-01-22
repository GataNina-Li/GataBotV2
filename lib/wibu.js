let axios = require('axios')
let cheerio = require('cheerio')

async function wibu(query) {
const res = await axios.get(`https://nontonanimeid.com/?s=${encodeURI(query)}`)
const $ = cheerio.load(res.data)
let hasil = []
$('#wrap > main > div.result > ul > li').each(function(a, b) {
let judul = $(b).find('a > div.top > h2').text()
let desc = $(b).find('a > div.top > div > p').text()
let gennr = []
$(b).find('span.genrebatas > span.genre').each(function(c, d) {
gennr.push($(d).text())
})
let genre = `${gennr}`.replace(/,/gi, ', ')
let rating = $(b).find('a > div.boxinfores > span.nilaiseries').text()
let link = $(b).find('a').attr('href')
let thumbnailawal = $(b).find('a > div.top > img').attr('data-src').slice(0,-3)
let thumbnail = `${thumbnailawal}1000`
hasil.push({judul,desc,genre,rating,link,thumbnail})
})
return hasil
}

module.exports = wibu