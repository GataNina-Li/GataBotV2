let handler = async (m, { conn, text }) => {
  if (!text) throw '❰ ❗️ ❱ *Agregue el texto que enviará el Bot*'
  m.reply(text, false, {
    contextInfo: {
      mentionedJid: conn.parseMention(text)
    }
  })
}
handler.help = ['mention <teks>']
handler.tags = ['tools']

handler.command = /^mention|mencionar|mensaje$/i

module.exports = handler
