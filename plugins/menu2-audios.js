let PhoneNumber = require('awesome-phonenumber')
let levelling = require('../lib/levelling')

let handler = async (m, { conn, usedPrefix }) => {

  let pp = './Menu2.jpg'
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
*_ミ💖 ¡Hola! ${username} 💖彡_*

*MENU DE AUDIOS*
✢ Solo escriba la palabra/frase. sin prefijo (/ . # etc...) 

➫🔊 _Noche de paz_
➫🔊 _Buenos dias_
➫🔊 _Audio hentai_
➫🔊 _Fiesta del admin_
➫🔊 _Fiesta del admin 2_
➫🔊 _Viernes_
➫🔊 _Chica lgante_
➫🔊 _Baneado_
➫🔊 _Feliz navidad_
➫🔊 _A nadie le importa_
➫🔊 _Sexo_
➫🔊 _Vete a la vrg_
➫🔊 _Hola_
➫🔊 _Un pato_
➫🔊 _Nyanpasu_
➫🔊 _Te amo_
➫🔊 _Yamete_
➫🔊 _Te diagnostico con gay_
➫🔊 _Quien es tu sempai botsito 7w7_
➫🔊 _Bañate_
➫🔊 _Vivan los novios_
➫🔊 _Marica quien_
➫🔊 _Es puto_
➫🔊 _La biblia_
➫🔊 _Onichan_
➫🔊 _Bot puto_
➫🔊 _Feliz cumpleaños_
➫🔊 _Shadow Bot_
➫🔊 _Pasa pack Bot_
➫🔊 _Atencion grupo_
➫🔊 _Oh me vengo_
➫🔊 _Murio el grupo_
➫🔊 _Siuuu_
➫🔊 _Rawr_
➫🔊 _UwU_
➫🔊 _:c_
➫🔊 _a_
            🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈
0:40 ━❍──────── -8:39
↻     ⊲  Ⅱ  ⊳     ↺
VOLUMEN: ▁▂▃▄▅▆▇ 100%`.trim()
    let mentionedJid = [who]
    conn.sendFile(m.chat, pp, 'lp.jpg', str, m, false, { contextInfo: { mentionedJid }})
  }
}
handler.help = ['menu2']
handler.tags = ['General']
handler.command = /^(menu2|audios|menú2|memu2|menuaudio|menuaudios|memuaudios|memuaudio|audios|audio)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
