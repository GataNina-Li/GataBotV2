process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { servers, yta } = require('../lib/y2mate')
let handler = async (m, { conn, args, isPrems, isOwner }) => {
let chat = global.DATABASE.data.chats[m.chat]
  if (!args || !args[0]) throw '*[❗] Inserte un enlace de YouTube*\n\n*Ejemplo:*\n*#ytmp3 https://www.youtube.com/watch?v=8jvDzEIVpjg*'
  let server = (args[1] || 'id4').toLowerCase()
  let { dl_link, thumb, title, filesize, filesizeF} = await yta(args[0], servers.includes(server) ? server : 'id4')
  //let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < filesize
 let fs = require('fs')
 let y = fs.readFileSync('./Menu2.jpg')


conn.sendMessage(m.chat, `*⏯ ️Descargador By ShadowBot ⏯️*\n\n*🔥Titulo:* ${title}\n*📂Tamaño del archivo:* ${filesizeF}` , 'conversation', {quoted: m, thumbnail: global.thumb, contextInfo:{externalAdReply: {title: 'Simple WhatsAppp Bot', body: `© ${conn.user.name}`, sourceUrl: 'enviando...', thumbnail: y}}})
conn.sendFile(m.chat, dl_link , `By ${conn.user.name}.mp3`, m, false, {ptt: true, duration: 999999999999, asDocument: chat.useDocument})
conn.sendFile(m.chat, dl_link , `By ${conn.user.name}.mp3`, m)
}
handler.command = /^yt(a|mp3)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0

module.exports = handler
