let PhoneNumber = require('awesome-phonenumber')
let levelling = require('../lib/levelling')

let handler = async (m, { conn, usedPrefix }) => {

  let pp = './Caja.jpg'
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
*_ミ💖 Hola ${username} 💖彡_*

ㅤㅤ *🗳️<CAJA FUERTE/>🔐*
- Aquí puede guardar mensajes que quieras ver mas tarde

*<AGREGAR A LA LISTA/>*

° ඬ⃟🗳️ _${usedPrefix}agregarmsg *texto/comando/palabra clave* (responde a un texto)_
° ඬ⃟🗳️ _${usedPrefix}agregarvn *texto/comando/palabra clave* (responde a una nota de voz)_
° ඬ⃟🗳️ _${usedPrefix}agregarvideo *texto/comando/palabra clave* (responde a un video)_
° ඬ⃟🗳️ _${usedPrefix}agregaraudio *texto/comando/palabra clave* (responde a un audio)_
° ඬ⃟🗳️ _${usedPrefix}agregarimg *texto/comando/palabra clave* (responde a una imagen)_
° ඬ⃟🗳️ _${usedPrefix}agregarsticker *texto/comando/palabra clave* (responde a un sticker)_

*<LISTAS DE COMANDOS/>*

° ඬ⃟🗳️ _${usedPrefix}listamsg_
° ඬ⃟🗳️ _${usedPrefix}listavn_
° ඬ⃟🗳️ _${usedPrefix}listavideo_
° ඬ⃟🗳️ _${usedPrefix}listaaudio_
° ඬ⃟🗳️ _${usedPrefix}listaimg_
° ඬ⃟🗳️ _${usedPrefix}listasticker_

*<VER TEXTOS O ARCHIVOS/>*

° ඬ⃟🗳️ _${usedPrefix}vermsg *texto/comando/palabra clave*_
° ඬ⃟🗳️ _${usedPrefix}vervn *texto/comando/palabra clave*_
° ඬ⃟🗳️ _${usedPrefix}vervideo *texto/comando/palabra clave*_
° ඬ⃟🗳️ _${usedPrefix}veraudio *texto/comando/palabra clave*_
° ඬ⃟🗳️ _${usedPrefix}verimg *texto/comando/palabra clave*_
° ඬ⃟🗳️ _${usedPrefix}versticker *texto/comando/palabra clave*_

*<ELIMINAR/>*

° ඬ⃟🗳️ _${usedPrefix}eliminarmsg *texto/comando/palabra clave*_
° ඬ⃟🗳️ _${usedPrefix}eliminarvn *texto/comando/palabra clave*_
° ඬ⃟🗳️ _${usedPrefix}eliminarvideo *texto/comando/palabra clave*_
° ඬ⃟🗳️ _${usedPrefix}eliminaraudio *texto/comando/palabra clave*_
° ඬ⃟🗳️ _${usedPrefix}eliminarimg *texto/comando/palabra clave*_
° ඬ⃟🗳️ _${usedPrefix}eliminarsticker *texto/comando/palabra clave*_

*_「 𝙏͚͜͝͠𝙝͚͜͝͠𝙚͚͜͝͠ ͚͜͝͠𝙎͚͜͝͠𝙝͚͜͝͠𝙖͚͜͝͠𝙙͚͜͝͠𝙤͚͜͝͠𝙬͚͜͝͠ ͚͜͝͠𝘽͚͜͝͠𝙧͚͜͝͠𝙤͚͜͝͠𝙠͚͜͝͠𝙚͚͜͝͠𝙧͚͜͝͠𝙨͚͜͝͠ ͚͜͝͠-͚͜͝͠ ͚͜͝͠𝘽͚͜͝͠𝙤͚͜͝͠𝙩͚͜͝͠ ͚͜͝͠  」_*`.trim()
    let mentionedJid = [who]
    conn.sendFile(m.chat, pp, 'lp.jpg', str, m, false, { contextInfo: { mentionedJid }})
  }
}
handler.help = ['menusimple']
handler.tags = ['General']
handler.command = /^(CajaFuerte)$/i
handler.rowner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
