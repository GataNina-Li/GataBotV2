let handler  = async (m, { conn, usedPrefix: _p }) => {
let info = `
*_➡️ GRUPO(S) OFICIAL DE GATABOT_*
✅ https://chat.whatsapp.com/Eg7m7mmb85IDLnSgFooDg6

*_➡️ GRUPO(S) DE COLABORACIÓN:_*
✅ https://chat.whatsapp.com/JlomZPEgo3bLmzjGUYPfyJ
`.trim() 

conn.fakeReply(m.chat, info, '0@s.whatsapp.net', '🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈', 'status@broadcast')
}
handler.command = /^(grupos|gruposofc|gruposofc)$/i

module.exports = handler
