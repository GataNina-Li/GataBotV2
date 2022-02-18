const { servers, yta, ytv } = require('../lib/y2mate')
let yts = require('yt-search')
let fetch = require('node-fetch')

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw `uhm.. cari apa?\n\ncontoh:\n${usedPrefix + command} toxic friends`
  let results = await yts(text)
  let vid = results.all.find(video => video.seconds < 3600)
  if (!vid) throw 'konten tidak ditemukan'
  let yt = false
  let yt2 = false
  let usedServer = servers[0]
  for (let i in servers) {
    let server = servers[i]
    try {
      yt = await yta(vid.url, server)
      yt2 = await ytv(vid.url, server)
      usedServer = server
      break
    } catch (e) {
      console.log(`server ${server} error!${servers.length >= i + 1 ? '' : '\ntrying another server...'}`)
    }
  }
  if (yt === false || yt2 === false) throw 'all servers failed!'
  let { dl_link, thumb, title, filesize, filesizeF } = yt
  await conn.send2ButtonLoc(m.chat, thumb, `
*judul:* ${title}
*server y2mate:* ${usedServer}
`.trim(), wm, `audio (${filesizeF})`, '.yta ' + vid.url, `video (${yt2.filesizeF})`, '.yt ' + vid.url, m)
}
handler.help = ['play'].map(v => v + ' <teks>')
handler.tags = ['internet', 'download']
handler.command = /^(p|play)$/i

module.exports = handler
