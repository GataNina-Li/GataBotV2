let handler = async (m, { conn, participants }) => {
  // if (participants.map(v=>v.jid).includes(global.conn.user.jid)) {
    if (!(m.chat in global.DATABASE._data.chats)) return m.reply('Este chat no está registrado en la BASE DE DATOS!')
    let chat = global.DATABASE._data.chats[m.chat]
    if (chat.isBanned) return m.reply('Este chat ha sido baneado por imcumplir alguna regla!')
    chat.isBanned = true
    m.reply('Listo!')
  // } else m.reply('Aquí hay un número de un host...')
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^banchat$/i
handler.rowner = false

handler.admin = true

module.exports = handler
