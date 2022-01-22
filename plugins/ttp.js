const fetch = require('node-fetch')
const { sticker } = require('../lib/sticker.js')
const { MessageType } = require('@adiwajshing/baileys')

let handler  = async (m, { conn, text }) => {

 try {
  if (!text) throw '*Uhm.. y el texto?*'
  if (text) {
   //await m.reply('*_Aguarde un momento..._*')
    let img = await (await fetch('https://leyscoders-api.herokuapp.com/api/textto-image?text=' + encodeURIComponent(text))).buffer()
    if (!img) throw img
    let stiker = await sticker(img, false, 'TTP', 'MIMIN')
    conn.sendMessage(m.chat, stiker, MessageType.sticker, {
      quoted: m
    })
  }
 } catch (e) {
   m.reply('*[❗] Agregue un texto*')
  }
}
handler.help = ['ttp <teks>']
handler.tags = ['sticker']
handler.command = /^attp2|s1|sa$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false
handler.register = false

handler.fail = null

module.exports = handler
