const { MessageType } = require('@adiwajshing/baileys')
const { toVideo } = require('../lib/converter')
let handler  = async (m, { conn, args }) => {
  try {
    let q = m.quoted ? m.quoted : m
      let img = await q.download()
      convert = await toVideo(img, 'webp')
      conn.sendMessage(m.chat, convert, MessageType.video, { quoted: m})
    } catch {
    m.reply('Conversation failed')
   }
}
handler.help = ['tovideo (reply stiker)']
handler.tags = ['General']
handler.command = /^tovideo|tomp4$/i 

module.exports = handler

