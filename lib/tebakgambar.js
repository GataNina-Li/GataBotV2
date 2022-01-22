const axios = require("axios")
const cheerio = require("cheerio")

async function tebakgambar() {
  let random_level = Math.floor(Math.random() * 136)
  let random_eq = Math.floor(Math.random() * 20)
  return axios.get(`https://jawabantebakgambar.net/level-${random_level}/`).then((val) => {
    let url = "https://jawabantebakgambar.net"
    const $ = cheerio.load(val.data)
    let href = $("ul > * > a").eq(random_eq)
    let jwbn = href.find("span").text()
    let img = href.find("img").attr("data-src")
    let src = url + img
    let petunjuk = jwbn.replace(/[AIUEO|aiueo]/g, "_")
    return {
      img: src,
      jawaban: jwbn,
      petunjuk,
    }
  })

}

module.exports = tebakgambar