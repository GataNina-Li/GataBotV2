let yts = require('yt-search')
let handler = async (m, { text }) => {
  if (!text) return m.reply('*Y el texto?*')
  let results = await yts(text)
  let teks = results.all.map(v => {
    switch (v.type) {
      case 'video': return `
✨ *${v.title}* 🎈 (${v.url})
⏳ Duración: ${v.timestamp}
📌 Fecha de subida: ${v.ago}
👀 ${v.views} vistas
      `.trim()
      case 'channel': return `
'✨' *${v.name}*\n ❇️ (${v.url})
 _${v.subCountLabel} 🗓 (${v.subCount}) Subscriber_
👀 ${v.videoCount} video
`.trim()
    }
  }).filter(v => v).join('\n========================================\n')
  m.reply(teks)
}
handler.help = ['', 'earch'].map(v => 'yts' + v + ' <pencarian>')
handler.tags = ['General']
handler.command = /^yts(earch)?$/i

module.exports = handler
