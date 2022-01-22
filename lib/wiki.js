const axios = require('axios')
const cheerio = require('cheerio')

async function wiki(query) {
  const url = `https://id.wikipedia.org/wiki/${query}`
            const { data } = await axios.get(url)
            const selector = cheerio.load(data)
            const result = selector('div[class="mw-parser-output"]')
            const title = selector('h1[id="firstHeading"]')
            let thumb = selector('#mf-section-0').find('div > div > a > img').attr('src')
            thumb = thumb ? thumb : '//pngimg.com/uploads/wikipedia/wikipedia_PNG35.png'
           thumb = 'https:' + thumb
            const paragraph = result.find('div[id="toc"]').prevUntil('table, div')
            const textArray = paragraph.text().split('\n').reverse().filter((el) => el !== '')
            const textClean = textArray.map((el) => el.replace(/\[([0-9]+)\]/g, ''))

            const resultResponse = { title: title.text(), result: textClean, thumb }
            return resultResponse
        }
module.exports = wiki