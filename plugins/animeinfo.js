let fetch = require('node-fetch')
let cheerio = require('cheerio')
let handler = async (m, { conn, text }) => {
  if (!text) throw `❰ ❗️ ❱ *Ingrese el nombre del anime a buscar* 🔎`
  let res = await fetch(global.API('https://api.jikan.moe', '/v3/search/anime', { q: text }))
  if (!res.ok) throw await res.text()
  let json = await res.json()
  let { title, members, synopsis, episodes, url, rated, score, image_url, type, start_date, end_date, mal_id } = json.results[0]
  //Scrape Genre MAL by DwiR
  let res2 = await fetch(`https://myanimelist.net/anime/${mal_id}`)
  if (!res2.ok) throw await res2.text()
  let html = await res2.text()
 // let { document } = new JSDOM(html).window
  //let genAnim = [...document.querySelectorAll('div[class="spaceit_pad"] > * a')].map(el => el.href).filter(href => href.startsWith('/anime/genre/'))
  let animeingfo = `✨ *Titulo:* ${title}
🎆 *Episodios:* ${episodes}
💬 *Transmitido en:* ${type}
💌 *Rating:* ${rated}
❤️ *Score:* ${score}
👥 *Miembros:* ${members}
💚 *Sinopsis en inglés:* ${synopsis}
🌐 *URL*: ${url}`
  conn.sendFile(m.chat, image_url, '', animeingfo, m)
}
handler.help = ['anime <judul>']
handler.tags = ['internet']
handler.command = /^(animeinfo)$/i
//maapin fatur :<
module.exports = handler
