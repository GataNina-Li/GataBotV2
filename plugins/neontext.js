let fetch = require('node-fetch')
let handler = async (m, { conn, args }) => {
   response = args.join(' ')
  if (!args) throw '*_Ingrese un texto_*'
  m.reply('*[❗] Aguarde un momento estoy haciendo su diseño...*')
  let res = `https://api.zeks.xyz/api/bneon?apikey=caliph_71&text=${response}`
  conn.sendFile(m.chat, res, 'nama.jpg', `*🔰 Aqui tienes*`, m, false)
}
handler.help = ['neontext'].map(v => v + ' <teks>')
handler.tags = ['sticker']
handler.command = /^(neontext)$/i
handler.limit = false
handler.register = false

module.exports = handler

//31caf10e4a64e86c1a92bcba
