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
╭══〘 🐈⚡️🐈⚡️🐈⚡️🐈 〙══╮    
⎪ *_ミ💖 ¡Hola! ${username} 💖彡_*
⎪≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
⎪ *MENU DE AUDIOS*
⎪≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
⎪ ✢ Solo escriba la palabra/frase. sin prefijo ⎪ (/ . # etc...) 
⎪≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
⎪➫🔊 _Noche de paz_
⎪➫🔊 _Buenos dias_
⎪➫🔊 _Audio hentai_
⎪➫🔊 _Fiesta del admin_
⎪➫🔊 _Fiesta del admin 2_
⎪➫🔊 _Viernes_
⎪➫🔊 _Me olvidé_
⎪➫🔊 _Baneado_
⎪➫🔊 _Feliz navidad_
⎪➫🔊 _A nadie le importa_
⎪➫🔊 _Sexo_
⎪➫🔊 _Vete a la vrg_
⎪➫🔊 _Ara ara_
⎪➫🔊 _Hola_
⎪➫🔊 _Un pato_
⎪➫🔊 _Nyanpasu_
⎪➫🔊 _Te amo_
⎪➫🔊 _Yamete_
⎪➫🔊 _Te diagnostico con gay_
⎪➫🔊 _Quien es tu sempai botsito 7w7_
⎪➫🔊 _Bañate_
⎪➫🔊 _Vivan los novios_
⎪➫🔊 _Marica quien_
⎪➫🔊 _Es puto_
⎪➫🔊 _La biblia_
⎪➫🔊 _Onichan_
⎪➫🔊 _Bot puto_
⎪➫🔊 _Feliz cumpleaños_
⎪➫🔊 _Shadow Bot_
⎪➫🔊 _Pasa pack Bot_
⎪➫🔊 _Atencion grupo_
⎪➫🔊 _Homero chino_
⎪➫🔊 _Oh me vengo_
⎪➫🔊 _Murio el grupo_
⎪➫🔊 _Siuuu_
⎪➫🔊 _Rawr_
⎪➫🔊 _UwU_
⎪➫🔊 _:c_
⎪➫🔊 _a_
⎪➫🔊 _Hey_
⎪➫🔊 _Enojado_
⎪➫🔊 _Enojada_
⎪➫🔊 _Chao_
⎪➫🔊 _Hentai_
⎪➫🔊 _Triste_
⎪➫🔊 _Estoy triste_
⎪➫🔊 _Me pican los cocos_
⎪➫🔊 _Contexto_
⎪➫🔊 _Me voy_
⎪➫🔊 _Tengo los calzones del admin_
⎪➫🔊 _Entrada épica_ 
⎪➫🔊 _Esto va ser épico papus_
⎪➫🔊 _Ingresa épicamente_
⎪➫🔊 _Bv_
⎪➫🔊 _Yoshi_
⎪➫🔊 _No digas eso papu_
⎪➫🔊 _Ma ma masivo_
⎪➫🔊 _Masivo_
⎪➫🔊 _Basado_
⎪➫🔊 _Basada_
⎪➫🔊 _Fino señores_
⎪➫🔊 _Verdad que te engañe_
⎪➫🔊 _Sus_
⎪➫🔊 _Ohayo_
⎪➫🔊 _La voz de hombre_
⎪➫🔊 _Pero esto_
⎪➫🔊 _Bien pensado Woody_
⎪➫🔊 _Jesucristo_
⎪➫🔊 _Wtf_
⎪➫🔊 _Una pregunta_
⎪➫🔊 _Que sucede_
⎪➫🔊 _Hablame_
⎪➫🔊 _Pikachu_
⎪➫🔊 _Niconico_
⎪➫🔊 _Yokese_
⎪➫🔊 _Omaiga_
⎪➫🔊 _Nadie te preguntó_
⎪➫🔊 _Bueno si_
⎪➫🔊 _Usted está detenido_
⎪➫🔊 _No me hables_
⎪➫🔊 _No chu_
⎪➫🔊 _El pepe_
⎪➫🔊 _Pokémon_
⎪➫🔊 _No me hagas usar esto_
⎪➫🔊 _Esto va para ti_
⎪➫🔊 _Abduzcan_
⎪➫🔊 _Joder_
⎪➫🔊 _Hablar primos_
⎪➫🔊 _Mmm_
⎪➫🔊 _Orale_
╰══〘 🐈⚡️🐈⚡️🐈⚡️🐈 〙══╯

╭════• ೋ•✧๑♡๑✧•ೋ •════╮
                      🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈
         0:40 ━❍──────── -8:39
         ↻     ⊲  Ⅱ  ⊳     ↺
         VOLUMEN: ▁▂▃▄▅▆▇ 100%
╰════• ೋ•✧๑♡๑✧•ೋ •════╯`.trim()
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
