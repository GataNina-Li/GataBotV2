let fetch = require('node-fetch')
let handler = async (m, { conn, command, text, usedPrefix }) => {
  await conn.send3Button(m.chat, `
*ミ💖 Hola! estimado/a usuario/a 💖彡*

*ミ🤖 Estado del Bot 🤖彡*
*=> Bot activo ✅*
*=> Bot uso público ✅*
`.trim(), 'Gata Dios', '🟢 MENÚ 🟢', `${usedPrefix}menu`, '🟠 MENÚ SIMPLE 🟠', `${usedPrefix}menusimple`, '🔵 MENÚ DE AUDIOS 🔵', `${usedPrefix}menuaudios`)
}
handler.command = /^(estado|status|estate|state|stado|stats)$/i

handler.exp = 0

module.exports = handler
