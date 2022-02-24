let handler = async (m, { conn, command, text }) => {
  if (!text) throw `Quién es *${command.replace('how', '').toUpperCase()}*`
  conn.reply(m.chat, `
_*${text}* *es* *${Math.floor(Math.random() * 2000)}%* *${command.replace('how', '').toUpperCase()}.* *Eeeeesssss putooo!! 😂*_
`.trim(), m, m.mentionedJid ? {
    contextInfo: {
      mentionedJid: m.mentionedJid
    }
  } : {})
}
handler.help = ['puto'].map(v => 'how' + v + ' quien es puto?')
handler.tags = ['kerang']
handler.command = /^(puto)/i
handler.owner = false
handler.mods = false
handler.premium = false 
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
