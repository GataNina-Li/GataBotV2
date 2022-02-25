let handler = async (m, { conn, text }) => {
  if (!text) return
  let who
  if (m.isGroup) who = m.mentionedJid[0]
  else who = m.chat
  if (!who) throw '❰ ❗️ ❱ *Etiqueta a una persona*\n\n*Uso correcto de comando:*\n*#save @tag 🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈*'
  txt = text.replace('@' + who.split`@`[0], '').trimStart()
  return conn.sendContact(m.chat, who, txt || conn.getName(who), m)
}
handler.help = ['save'].map(v => v + ' @mention <ContactName>')
handler.tags = ['']

handler.command = /^save|agendar|guardar$/

module.exports = handler
