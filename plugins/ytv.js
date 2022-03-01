process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let fetch = require('node-fetch')
const { servers, ytv } = require('../lib/y2mate')
let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
  if (!args || !args[0]) throw '*Inserte un enlace de YT*'
 // let chat = global.db.data.chats[m.chat]
  let server = (args[1] || servers[0]).toLowerCase()
  try {
    let { dl_link, thumb, title, filesize, filesizeF } = await ytv(args[0], servers.includes(server) ? server : servers[0])
    //let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < filesize
    //m.reply(isLimit ? `*🔰 Tamaño del video: ${filesizeF}*\n\n*✳️ Tamaño máximo para poder enviar: ${limit} MB*\n\n*Puede descargar usted mismo el video a través de este enlace:*\n*→ ${dl_link}*\n*👉🏻 Al entrar automáticamente se le descargará*` : global.wait)
    let _thumb = {}
    try { _thumb = { thumbnail: await (await fetch(thumb)).buffer() } }
    catch (e) { }
    await m.reply(`*✳️ Espere un momento, estoy descargando su video*\n\n*⚠️ Si su vídeo no es envíado después de 5 minutos, por favor inténtelo nuevamente, si el error perdura intente con un video de menor tamaño*`)
conn.sendFile(m.chat, dl_link, '', `
*🔰 Aquí tienes tu video*
  `.trim(), m, 0, {
      ..._thumb,
    //  asDocument: chat.useDocument
    })
  } catch (e) {
    return await conn.sendButton(m.chat, '*El servidor 1 fallo*\n\n*Quiere volver a intentarlo con otro servidor?*', '', 'VOLVER A INTENTAR', `${usedPrefix + command} ${args[0]}`)
  }
}
handler.help = ['mp4', 'v', ''].map(v => 'yt' + v + ` <url> [server: ${servers.join(', ')}]`)
handler.tags = ['downloader']
handler.command = /^dlvid|dlyt2|dlvideo$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = false

module.exports = handler
