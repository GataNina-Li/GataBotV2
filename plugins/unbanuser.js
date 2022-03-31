let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, text}) => {
    if (!text) throw '*A quien quiere desbanear? etiquete a la persona con el @*'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw '*Etiquete a una persona con el @*'
    let users = global.DATABASE._data.users
    users[who].banned = false
    conn.reply(m.chat, `*✅ Listo, usuario desbaneado*\n\n*Ya puede usar a GataBot!*`, m)
}
handler.help = ['ban']
handler.tags = ['owner']
handler.command = /^unbanuser|quitarbanusuario|conbot$/i
handler.admin = true
handler.botAdmin = true


module.exports = handler
