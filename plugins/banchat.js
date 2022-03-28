let handler = async (m, { conn, participants }) => {
  // if (participants.map(v=>v.jid).includes(global.conn.user.jid)) {
    if (!(m.chat in global.DATABASE._data.chats)) return m.reply('*Este chat no está registrado en la base de datos!*')
    let chat = global.DATABASE._data.chats[m.chat]
    if (chat.isBanned) return m.reply('*Este chat ya estaba baneado previamente*\n*Si desea desbanearlo use /unbanchat*')
    chat.isBanned = true
    m.reply('✅ *Este chat ha sido baneado a desicion de un administrador del grupo*')
  // } else m.reply('Aquí hay un número de un host...')
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^banchat$/i
handler.rowner = false

handler.admin = true

module.exports = handler
