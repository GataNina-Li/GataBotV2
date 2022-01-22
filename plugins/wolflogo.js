let fetch = require('node-fetch')
let handler = async (m, { conn, args }) => {
   response = args.join(' ').split('|')
  if (!args[0]) throw '*_Ingrese un texto_*'
  m.reply('*[ ❗ ]  Espere un momento, estoy realizando tu diseño..*')
  let res = `https://api.zeks.xyz/api/wolflogo?apikey=apivinz&text1=${response[0]}&text2=${response[1]}`
  conn.sendFile(m.chat, res, 'error.jpg', `*_Aqui tienes :D_*`, m, false)
}
handler.help = ['wolflogo'].map(v => v + ' <text|text>')
handler.tags = ['General']
handler.command = /^(wolflogo)$/i

module.exports = handler

