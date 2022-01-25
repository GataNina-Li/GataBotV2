let fetch = require('node-fetch')
let handler = async(m, { conn }) => {
  let res = await fetch('https://api.waifu.pics/sfw/waifu')
  if (!res.ok) throw await res.text()
  let json = await res.json()
  if (!json.url) throw 'Error!'
  conn.sendFile(m.chat, json.url, '', '*A~Ara Ara Sempai*', m)
}
handler.help = ['waifu']
handler.tags = ['General']
handler.command = /^(waifu)$/i

module.exports = handler
