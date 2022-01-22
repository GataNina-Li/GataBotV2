let limit = 30
const { servers, yta } = require('../lib/y2mate')
let handler = async (m, { conn, args, isPrems, isOwner }) => {
  if (!args || !args[0]) return m.reply('Uhm... urlnya mana?')
  let chat = global.DATABASE._data.chats[m.chat]
  let server = (args[1] || servers[0]).toLowerCase()
  let { dl_link, thumb, title, filesize, filesizeF} = await yta(args[0], servers.includes(server) ? server : servers[0])
  let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < filesize
  m.reply(isLimit ? `*🔰 Tamaño del audio: ${filesizeF}*\n\n*✳️ Tamaño máximo para poder enviar: ${limit} MB*\n\n*Puede descargar usted mismo el audio a través de este enlace:*\n*→ ${dl_link}*\n*👉🏻 Al entrar automáticamente se le descargará*` : global.wait)
  await m.reply(`*✳️ Espere un momento, estoy descargando su audio*\n\n*⚠️ Si su audio no es envíado después de 5 minutos, por favor inténtelo nuevamente, si el error perdura intente con un audio de menor tamaño*`)
  //conn.sendFile(m.chat, thumb, 'thumbnail.jpg', `
//❒═════❬ YTMP3 ❭═════╾❒
//┬
//├‣*✨Nombre:* ${title}
//┴
//├‣*📂Tamaño:* ${filesizeF}
//┴
//├‣*${isLimit ? 'Pakai ': ''}Link de descarga (usar si el Bot no manda el archivo mp3):* ${dl_link}
//┴
//`.trim(), m)
  if (!isLimit) conn.sendFile(m.chat, dl_link, title + '.mp3', `
❒═════❬ YTMP3 ❭═════╾❒
┬
├‣*✨Nombre:* ${title}
┴
├‣*📂Tamaño:* ${filesizeF}
┴
`.trim(), m, null, {
//  asDocument: chat.useDocument
})
}
handler.help = ['mp3','a'].map(v => 'yt' + v + ` <url> [server: ${servers.join(', ')}]`)
handler.tags = ['General']
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

