const uploadImage = require('../lib/uploadImage') 
const { sticker } = require('../lib/sticker')
const { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text }) => {
 try {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw '*_Sin imagen_*'
  if (!/image\/(jpe?g|png)/.test(mime)) throw `*_El archivo ${mime} no es compatible_*`
  let img = await q.download()
  let url = await uploadImage(img)
  let wanted = global.API('dzx', '/api/canvas/circle', { url }) //`https://api.dhamzxploit.my.id/api/canvas/circle?url=${url}`
  let stiker = await sticker(null, wanted, 'circle', '©The Shadow Brokers - Bot')
  conn.sendMessage(m.chat, stiker, MessageType.sticker, {
    quoted: m
  })
 } catch (e) {
   m.reply('*_Conversion fallida_*\n\n*_Vuelva a intentarlo_*\n\n*_Recuerde enviar una imagen con el comando #circle o responder a la imagen con el comando_*')
  }
}
handler.help = ['circle']
handler.tags = ['sticker']
handler.command = /^circle$/i

module.exports = handler
