let fetch = require('node-fetch')
let handler = async (m, { conn, text, participants, usedPrefix, command }) => {
  if (!text) throw! `*Ingrese un numero o corrobore que el numero ingresado este escrito correctamente y en formato internacional*\n*Ejemplo:*\n\n*${usedPrefix + command + ' ' + global.owner[0]}*`
  let _participants = participants.map(user => user.jid)
  let users = (await Promise.all(
    text.split(',')
      .map(v => v.replace(/[^0-9]/g, ''))
      .filter(v => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
      .map(async v => [
        v,
        await conn.isOnWhatsApp(v + '@s.whatsapp.net')
      ])
  )).filter(v => v[1]).map(v => v[0] + '@c.us')
  let response = await conn.groupAdd(m.chat, users)
  if (response[users] == 408) throw `*El numero se salio recientemente*\n*La unica manera de añadirlo es por medio del enlace del grupo. Usa ${usedPrefix}link para obtener el enlace*`
  let pp = await conn.getProfilePicture(m.chat).catch(_ => false)
  let jpegThumbnail = pp ? await (await fetch(pp)).buffer() : false
  for (let user of response.participants.filter(user => Object.values(user)[0].code == 403)) {
    let [[jid, {
      invite_code,
      invite_code_exp
    }]] = Object.entries(user)
    let teks = `*No fue posible añadir a @${jid.split('@')[0]}*\n*Enviando invitacion a su privado...*`
    m.reply(teks, null, {
      contextInfo: {
        mentionedJid: conn.parseMention(teks)
      }
    })
    await conn.sendGroupV4Invite(m.chat, jid, invite_code, invite_code_exp, false, '¡Hola!, me presento, soy 🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈, y soy un Bot para WhatsApp, una persona del grupo utilizo el comando para añadirte al grupo, pero no pude agregarte, asi que te mando la invitacion para que te agregues, te esperamos!!', jpegThumbnail ? {
      jpegThumbnail
    } : {})
  }
}
handler.help = ['add', '+'].map(v => v + ' número')
handler.tags = ['admin']
handler.command = /^(add|agregar|añadir|\+)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = true
handler.botAdmin = true

handler.fail = null
handler.limit = false

module.exports = handler
