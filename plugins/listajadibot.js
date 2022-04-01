async function handler(m, { usedPrefix }) {
  let users = [...new Set([...global.conns.filter(conn => conn.user && conn.state !== 'close').map(conn => conn.user)])]
  m.reply( '*🚀 Lista de Sub bots por GataBot 🚀*\n\n*😸 Puedes contactarlos para solicitar que se unen a tu grupo*\n\n*Considera por favor:*\n*✅ Ser amable, no insistir ni discutir*\n\n*✳ ️Si el siguiente texto esta vacio es que no hay ningún Sub bot disponible en este momento, inténtelo mas tarde*\n\n✅ *Si quieres Ser Bot escribe #jadibot o #serbot*\n\n*❰ ❗️ ❱ _NOTA: ️SON PERSONAS QUE NO CONOCEMOS. EL EQUIPO DE GATA DIOS NO SE HACE RESPONSABLE DE LO QUE PUEDA OCURRIR._*')
  m.reply(users.map(v => '🐈 Wa.me/' + v.jid.replace(/[^0-9]/g, '') + ` ⬅️ escriba: ${usedPrefix}estado \n(${v.name})\n`).join('\n'))
}
handler.command = handler.help = ['listjadibot','bots','subsbots']
handler.tags = ['jadibot']

module.exports = handler 
