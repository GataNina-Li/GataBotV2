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
*_ミ💖 ¡Hola! ${username} 💖彡_*
⚡️ *CAJA DE ALMECENAMIENTO* ⚡️

*¡Te presentamos Caja de Almacenamiento!* 
_En donde podrás guardar mensajes/archivos multimedia. Para luego verlos con un comando personalizado._

✅ *AGREGAR A LA LISTA* 
*Ejemplo:* ${usedPrefix}agregarmsg comando1

❖📦 _${usedPrefix}agregarmsg *comando/palabra clave* (responde a un texto)_
❖📦 _${usedPrefix}agregarvn *comando/palabra clave* (responde a una nota de voz)_
❖📦 _${usedPrefix}agregarvideo *comando/palabra clave* (responde a un video)_
❖📦 _${usedPrefix}agregaraudio *comando/palabra clave* (responde a un audio)_
❖📦 _${usedPrefix}agregarimg *comando/palabra clave* (responde a una imagen)_
❖📦 _${usedPrefix}agregarsticker *comando/palabra clave* (responde a un sticker)_
*_NOTA:_* tiene que responder al mensaje/archivo multimedia para ser agregado.


✳️ *LISTAS DE COMANDOS*

❖🗃 _${usedPrefix}listamsg_
❖🗃 _${usedPrefix}listavn_
❖🗃 _${usedPrefix}listavideo_
❖🗃 _${usedPrefix}listaaudio_
❖🗃 _${usedPrefix}listaimg_
❖🗃 _${usedPrefix}listasticker_


❇️ *VER TEXTOS O ARCHIVOS*
*_Para ver el contenido del comando personalizado:_*
*Ejemplo:* ${usedPrefix}vermsg comando1

❖📄 _${usedPrefix}vermsg *comando/palabra clave*_
❖📄 _${usedPrefix}vervn *comando/palabra clave*_
❖📄 _${usedPrefix}vervideo *comando/palabra clave*_
❖📄 _${usedPrefix}veraudio *comando/palabra clave*_
❖📄 _${usedPrefix}verimg *comando/palabra clave*_
❖📄 _${usedPrefix}versticker *comando/palabra clave*_


❎ *ELIMINAR COMANDO/PALABRA*
*_Para eliminar el comando personalizado:_*
*Ejemplo:* ${usedPrefix}eliminarmsg comando1

❖🗑 _${usedPrefix}eliminarmsg *comando/palabra clave*_
❖🗑 _${usedPrefix}eliminarvn *comando/palabra clave*_
❖🗑 _${usedPrefix}eliminarvideo *comando/palabra clave*_
❖🗑 _${usedPrefix}eliminaraudio *comando/palabra clave*_
❖🗑 _${usedPrefix}eliminarimg *comando/palabra clave*_
❖🗑 _${usedPrefix}eliminarsticker *comando/palabra clave*_

              *「 🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈 」*`.trim()
    let mentionedJid = [who]
    conn.sendFile(m.chat, pp, 'lp.jpg', str, m, false, { contextInfo: { mentionedJid }})
  }
}
handler.help = ['menusimple']
handler.tags = ['General']
handler.command = /^(caja|Caja|almacen|Almacen|almacenamiento|cjalmacen|cajaalmacenamiento|cajalmacenamiento|menucaja|menualmacen|Menucaja|Menualmacen)$/i
handler.rowner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
