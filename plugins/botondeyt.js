let fetch = require('node-fetch')
let handler = async (m, { conn, args }) => {
   response = args.join(' ')
  if (!args) throw 'Ingrese un texto'
  m.reply('*[ ❗ ] Espere un momento...*')
  let res = `https://api.zeks.xyz/api/splaybutton?text=${response}&apikey=apivinz`
  conn.sendFile(m.chat, res, 'splaybutton.jpg', `Felicidades por sus 100k 😍`, m, false)
}
handler.help = ['botondeyt'].map(v => v + ' <teks>')
handler.tags = ['image']
handler.command = /^(botondeyt|ytbotton|ytboton|placadeyt)$/i

module.exports = handler