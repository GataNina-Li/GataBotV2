let handler = async (m, { text }) => {
  let user = global.DATABASE.data.users[m.sender]
  user.afk = + new Date
  user.afkReason = text
  m.reply(`*[ ⚠️ ] El usuario ${conn.getName(m.sender)} estará inactivo (AFK) no lo etiqueten*\n\n*🔰 Motivo de la inactividad${text ? ': ' + text : ''}*
`)
}
handler.help = ['afk [alasan]']
handler.tags = ['main']
handler.command = /^afk$/i

module.exports = handler
