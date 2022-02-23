let PhoneNumber = require('awesome-phonenumber')
let levelling = require('../lib/levelling')

let handler = async (m, { conn, usedPrefix }) => {

  let pp = './Bot.jpg'
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  try {
//    pp = await conn.getProfilePicture(who)
  } catch (e) {

  } finally {
    let about = (await conn.getStatus(who).catch(console.error) || {}).status || ''
    let { name, limit, exp, banned, lastclaim, registered, regTime, age, level } = global.DATABASE.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let username = conn.getName(who)
    let str = `
*✨ ¿𝐐𝐮𝐞́ 𝐞𝐬 𝐮𝐧 𝐁𝐨𝐭 𝐝𝐞 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩? ✨*

🍃 _Un Bot es una inteligencia programada que permite realizar actividades dependiendo de lo que solicite. En temas de WhatsApp, es posible crear stickers, descargar música, vídeos, crear logos, buscar imágenes, interactuar en modo de conversación,  participar en juegos dentro de chats etc..._

🍃 *_Para ver el menú de comandos puedes usar:_*
#menu

🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈`.trim()
    let mentionedJid = [who]
    conn.sendFile(m.chat, pp, 'lp.jpeg', str, m, false, { contextInfo: { mentionedJid }})
  }
}
handler.customPrefix = /¿Qué es un Bot?|¿Qué es Bot?|Qué es Bot|qué es Bot|QUÉ ES UN BOT|¿QUÉ ES UN BOT?|¿qué es un Bot?|qué es un Bot|que es un Bot|Qué es un Bot?|Que es un Bot?/i
handler.command = new RegExp

handler.fail = null

module.exports = handler
