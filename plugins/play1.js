process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let yts = require('yt-search')
let fetch = require('node-fetch')
const { servers, yta, ytv } = require('../lib/y2mate')
let handler = async (m, { conn, command, text }) => {
  if (!text) throw '*✳️ Inserte el nombre/título del video o audio a bucar*\n\n*Ejemplo:*\n*#play Juan Solo - Querido Corazón*'
  let results = await yts(text)
  let vid = results.all.find(video => video.seconds < 3600)
  if (!vid) throw '*Video/Audio No encontrado* '
  let isVideo = /2$/.test(command)
  let { dl_link, thumb, title, filesize, filesizeF} = await (isVideo ? ytv : yta)(vid.url, 'id4')
  //let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < filesizesLimit
m.reply('*⏳Procesando⏳*\n\n*[ ⚠ ️] Presentamos fallas con el servidor de música. Los comandos con fallas son {#play, #play2, #play3, #ytmp3, #ytmp4} ya trabajamos en una solución*')
  conn.sendFile(m.chat, thumb, 'thumbnail.jpg', `
*⏯ ️Reproductor By Shadow Brokers - Bot ⏯️*
*${title}*
*⇄ㅤ     ◁   ㅤ  ❚❚ㅤ     ▷ㅤ     ↻*
*📂Tamaño del archivo:* ${filesizeF}
*👉🏻Aguarde un momento en lo que envío su audio/video*
`.trim(), m)
  let _thumb = {}
  try { if (isVideo) _thumb = { thumbnail: await (await fetch(thumb)).buffer() } }
  catch (e) { }
  conn.sendFile(m.chat, dl_link, title + '.mp' + (3 + /2$/.test(command)), `
*🔰 Aquí esta su video*
*🔥Título:* ${title}
*📂Tamaño del archivo:* ${filesizeF}
`.trim(), m, false, _thumb || {})
}
handler.help = ['play', 'play2'].map(v => v + ' <canción >')
handler.tags = ['downloader']
handler.command = /^play2?$/i
handler.group = false

handler.exp = 0
handler.registrar = false
handler.limit = false

module.exports = handler
