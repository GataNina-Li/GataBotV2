axios = require('axios')
cheerio = require('cheerio')

unikod = async () => {
res = await axios.get(`https://coolsymbol.com/`) 
$ = cheerio.load(res.data) 
unikod = []
$('span.cs').each(function(a, b) {
unik = $(b).text() 
unikod.push(unik)
}) 
return unikod
}

module.exports = { unikod }