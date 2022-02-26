let handler = async (m, { conn }) => {
  if (!(m.chat in global.DATABASE._data.chats)) return m.reply('*Este chat no está registrado en la base de datos!*')
  let chat = global.DATABASE._data.chats[m.chat]
  if (!chat.isBanned) return m.reply('*Este chat no está prohibido!!*')
  chat.isBanned = false
  m.reply('*✅ Listo. Chat desbaneado!*')
}
handler.help = ['unbanchat']
handler.tags = ['General']
handler.command = /^unbanchat$/i
handler.owner = false
handler.admin = true

module.exports = handler
