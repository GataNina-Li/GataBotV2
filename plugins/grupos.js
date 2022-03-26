let handler  = async (m, { conn, usedPrefix: _p }) => {
let info = `
*_➡️ GRUPO(S) OFICIAL DE 𝗖𝗮𝗺𝗶𝗹𝗼 𝗕𝗼𝘁_*
✅ https://chat.whatsapp.com/FACD8CyieFHHCSPp7jFvlb

*_➡️ GRUPO(S)_*
✅ https://chat.whatsapp.com/DNnoeLJFBdGKcUlwLAJa4t



`.trim() 

conn.fakeReply(m.chat, info, '0@s.whatsapp.net', '🎇 𝗖𝗮𝗺𝗶𝗹𝗼 𝗕𝗼𝘁 🎇', 'status@broadcast')
}
handler.command = /^(grupos|gruposofc|gruposofc)$/i

module.exports = handler
