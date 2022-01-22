const axios = require('axios')
const cheerio = require('cheerio')

const covid = async (negara) => {
const res = await axios.get(`https://www.worldometers.info/coronavirus/country/${negara}/`) 
const $ = cheerio.load(res.data)
hasil = {}
a = $('div#maincounter-wrap')
hasil.status = res.status
hasil.kasus = $(a).find('div > span').eq(0).text()
hasil.kematian = $(a).find('div > span').eq(1).text() 
hasil.sembuh = $(a).find('div > span').eq(2).text() 
return hasil
}


module.exports = covid