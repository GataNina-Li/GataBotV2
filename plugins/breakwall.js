let fetch = require('node-fetch')
let handler = async (m, { conn, args }) => {
   response = args.join(' ')
  if (!args) throw 'Masukkan Parameter'
  m.reply('*[❗] Aguarde un momento estoy realizando su diseño...*')
  let res = `https://api.zeks.xyz/api/breakwall?apikey=MIMINGANZ&text=${response}`
  conn.sendFile(m.chat, res, 'error.jpg', `*🔰 Aquí tienes*`, m, false)
}
handler.help = ['breakwall'].map(v => v + ' <teks>')
handler.tags = ['sticker']
handler.command = /^(breakwall)$/i
handler.limit = false
handler.register = false

module.exports = handler

