let handler = async (m, { conn, text }) => {
    let name = m.fromMe ? conn.user : conn.contacts[m.sender]

  conn.reply(m.chat, `
*[ ⚠ ️] No etiquetes a mi creador, si es algo urgente contacta con el a su chat privado*
`.trim(), m)
    let mentionedJid = [m.sender]
}
handler.customPrefix = /@5219996125657|@17722386341/i
handler.command = new RegExp

module.exports = handler