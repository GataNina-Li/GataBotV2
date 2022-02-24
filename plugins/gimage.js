let { promisify } = require('util')
let _gis = require('g-i-s')
let gis = promisify(_gis)
let fetch = require('node-fetch')

let handler = async (m, { conn, text, command, usedPrefix, watermark }) => {
  if (!text) throw `*Sobre que texto quiere buscar imagenes..?*\n\n*Ejemplo:*\n${usedPrefix + command} hoja`
  let results = await gis(text) || []
  let { url, width, height } = pickRandom(results) || {}
  if (!url) throw '404 Not Found'
  conn.sendButtonImg(m.chat, await (await fetch(url)).buffer(), `*◅─ 「 Google imagen 」 ─▻*\n*➸「 ${text} 」\n 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨`, watermark, 'SIGUIENTE 🔄', `.gimage ${text}`, m)
}
handler.help = ['gimage <query>', 'image <query>']
handler.tags = ['internet', 'tools']
handler.command = /^(gimage|image|imagen)$/i 

module.exports = handler

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
