require('../config')

async function cnn(type = 'nasional') {
hasil = []
axios.get(`https://www.cnnindonesia.com/${type}`).then(async res => {
const $ = await cheerio.load(res.data)
$('article').each(function(a, b) {
const link = $(b).find('a').attr('href')
const thumb = $(b).find('img').attr('src') 
const judul = $(b).find('img').attr('alt')
hasil.push({ judul, link, thumb })
})
})
return hasil
}

module.exports = cnn