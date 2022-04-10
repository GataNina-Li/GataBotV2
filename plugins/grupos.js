let handler  = async (m, { conn, usedPrefix: _p }) => {
let info = `
*_➡️ GRUPO(S) OFICIAL DE GATABOT_*
✅ https://chat.whatsapp.com/Hahc7UwSouH9jIDStkT5QW

*_➡️ GRUPO(S)_*
✅ https://chat.whatsapp.com/BlasuG7z02d16wEaCf61pa
`.trim() 

conn.fakeReply(m.chat, info, '0@s.whatsapp.net', '🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈', 'status@broadcast')
}
handler.command = /^(grupos|gruposofc|gruposofc)$/i

module.exports = handler
