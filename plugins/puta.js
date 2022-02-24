let handler = async (m, { conn, command, text }) => {
  if (!text) throw `Quién es *${command.replace('how', '').toUpperCase()}*`
  conn.reply(m.chat, `
_*${text}* *es* *${Math.floor(Math.random() * 2000)}%* *${command.replace('how', '').toUpperCase()}.* *¿Alguien quire sus servicios? 🥵*_
`.trim(), m, m.mentionedJid ? {
    contextInfo: {
      mentionedJid: m.mentionedJid
    }
  } : {})
}
handler.help = ['puta'].map(v => 'how' + v + ' quien es puta?')
handler.tags = ['kerang']
handler.command = /^(puta)/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
