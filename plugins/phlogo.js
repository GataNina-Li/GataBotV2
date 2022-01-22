let fetch = require('node-fetch')
let handler = async (m, { conn, args }) => {
   response = args.join(' ').split('|')
  if (!args[0]) throw 'Ingrese un texto'
  m.reply('*[❗]Aguarde un momento, estoy realizando su diseño...*\n\n_Si el bot no manda la imagen o la manda en formato de archivo, intentarlo nuevamente pero con menos texto_\n\n_©The Shadow Brokers - Bot_')
  let res = `https://api.zeks.xyz/api/phlogo?text1=${response[0]}&text2=${response[1]}&apikey=apivinz`
  conn.sendFile(m.chat, res, 'phlogo.jpg', `Nih kak`, m, false)
}
handler.help = ['phlogo'].map(v => v + ' <text|text>')
handler.tags = ['sticker']
handler.command = /^(phlogo)$/i

module.exports = handler

