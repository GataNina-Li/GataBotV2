let handler  = async (m, { conn }) => {
  if (global.conn.user.jid == conn.user.jid) conn.reply(m.chat, '*Por qué no vas directamente con el numero del Bot?*', m)
  else {
    await conn.reply(m.chat, 'Adiós Bot 🥺', m)
    conn.close()
  }
}
handler.help = ['berhenti','stop']
handler.tags = ['General']
handler.command = /^(berhenti|stop)$/i
handler.owner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

