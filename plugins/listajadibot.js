async function handler(m, { usedPrefix }) {
  let users = [...new Set([...global.conns.filter(conn => conn.user && conn.state !== 'close').map(conn => conn.user)])]
  m.reply( '*🤖 Lista de algunos sub bots (jadibot/serbot) 🤖️*\n\n*🔰 Puedes contactarlos para ver si se unen a tu grupo*\n\n*Considera por favor:*\n*✅ Ser amable*\n*✅ No insistir ni discutir*\n\n*✳ ️Si le aparece el siguiente texto en blanco es que no hay ningún sub bot disponible en este momento inténtelo mas tarde*\n\n*❰ ❗️ ❱ _NOTA: ️SON PERSONAS QUE NO CONOCEMOS. EL EQUIPO DE GATA DIOS NO SE HACE RESPONSABLE DE LO QUE PUEDA OCURRIR._*')
  m.reply(users.map(v => 'Wa.me/' + v.jid.replace(/[^0-9]/g, '') + `?text=#estado \n(${v.name})\n\n`).join('\n'))
}
handler.command = handler.help = ['listjadibot','bots','subsbots']
handler.tags = ['jadibot']

module.exports = handler 
