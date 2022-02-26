//made by Anshul
const uploadImage = require('../lib/uploadImage')
const { sticker } = require('../lib/sticker')
const { MessageType } = require('@adiwajshing/baileys')
const effects = ['greyscale', 'invert', 'brightness', 'threshold', 'sepia', 'red', 'green', 'blue', 'blurple', 'pixelate', 'blur']

let handler = async (m, { conn, usedPrefix, text }) => {
  let effect = text.trim().toLowerCase()
  if (!effects.includes(effect)) throw `
*_✳️ USO CORRECTO DEL COMANDO ✳️_*

*👉 Use:* ${usedPrefix}stickerfilter (efecto) 
✅ *responda a una imagen*

*✅ Ejemplo:* ${usedPrefix}stickerfilter greyscale

*Lista de efectos:*
${effects.map(effect => `_✨ ${effect}_`).join('\n')}
`.trim()
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw '*_🔰 No se encontro la imagen_*\n\n*_✅ Responda a una imagen_*'
  if (!/image\/(jpe?g|png)/.test(mime)) throw `*_⚠️ Formato no admitido_*\n\n*_👉 Responda a una imagen_*`
  let img = await q.download()
  let url = await uploadImage(img)
  let apiUrl = global.API('https://some-random-api.ml/canvas/', encodeURIComponent(effect), {
    avatar: url
  })
  try {
    let stiker = await sticker(null, apiUrl, global.packname, global.author)
    await conn.sendMessage(m.chat, stiker, MessageType.sticker, {
      quoted: m
    })
  } catch (e) {
    m.reply('*_⚠️ Ocurrió un error al hacer la conversión a sticker_*\n\n*_✳️ Enviando imagen en su lugar..._*')
    await conn.sendFile(m.chat, apiUrl, 'image.png', null, m)
  }
}

handler.help = ['stickfilter (caption|reply media)']
handler.tags = ['General']
handler.command = /^(stickerfilter|stikerfilter|cs2)$/i
handler.limit = false
handler.group = false
handler.register = false
module.exports = handler
