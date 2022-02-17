let handler = m => m
handler.before = m => {
  let user = global.DATABASE.data.users[m.sender]
  if (user.afk > -1) {
    m.reply(`
_😸 Regresó al grupo del AFK._

${user.afkReason ? ' 👉 *Finalizó su razón:* ' + user.afkReason : ''}
✅ *Ya no esta ausente.*
⌛️ *Tiempo total de su ausencia:* ${clockString(new Date - user.afk)}
`.trim())
    user.afk = -1
    user.afkReason = ''
  }
  let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
  for (let jid of jids) {
    let user = global.DATABASE.data.users[jid]
    if (!user) continue
    let afkTime = user.afk
    if (!afkTime || afkTime < 0) continue
    let reason = user.afkReason || ''
    m.reply(`
*¡No lo/a etiquetes!*
_😺 Se encuentra en AFK (Lejos del teclado)._

👉 ${reason ? ' *Razón:* ' + reason : ' *Sin razón* '}
☑️ *Sigue ausente.*
⏳ *Tiempo de ausencia:* ${clockString(new Date - afkTime)}
`.trim())
  }
  return true
}

module.exports = handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}
