let fetch = require('node-fetch')
let handler = async (m, { conn, command, text, usedPrefix }) => {
  await conn.send3Button(m.chat, `
╭══✨• ೋ•✨๑๑💗๑๑✨•ೋ •✨══╮

*ミ💖 ¡Hola! estimado/a usuario/a 💖彡*

*ミ🤖 Estado de GataBot 🤖彡*
*=> ✅ Bot activo y de uso público*

╰══✨• ೋ•✨๑๑💗๑๑✨•ೋ •✨══╯
`.trim(), 'Gata Dios', '🌀 MENÚ 🌀', `${usedPrefix}menu`, '🔆 MENÚ COMPLETO 🔆', `${usedPrefix}menucompleto`, '♨️ MENÚ DE AUDIOS ♨️', `${usedPrefix}menuaudios`)
}
handler.command = /^(estado|status|estate|state|stado|stats)$/i

handler.exp = 0

module.exports = handler
