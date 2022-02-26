const uploadImage = require('../lib/uploadImage') 
const { sticker } = require('../lib/sticker')
const { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text }) => {
 try {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw '*✳️ Responda a una foto*'
  if (!/image\/(jpe?g|png)/.test(mime)) throw `*❗Tamaño o formato no soportado*`
  let img = await q.download()
  let url = await uploadImage(img)
  let wanted = global.API('dzx', '/api/canvas/rainbow', { url }) //`https://api.dhamzxploit.my.id/api/canvas/rainbow?url=${url}`
  let stiker = await sticker(null, wanted, 'Rainbow', 'GataBot 🐈 - Gata Dios')
  conn.sendMessage(m.chat, stiker, MessageType.sticker, {
    quoted: m
  })
 } catch (e) {
   m.reply('*Conversión fallida, recuerde responder a una imagen*')
  }
}
handler.help = ['rainbow']
handler.tags = ['sticker']
handler.command = /^stickergay|stikergay|gaysticker|gaystiker|sgay$/i

module.exports = handler
