let PhoneNumber = require('awesome-phonenumber')
let levelling = require('../lib/levelling')

let handler = async (m, { conn, usedPrefix }) => {

  let pp = './+18.jpg'
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
*Hola ${username}, aqui tienes el menu +18*

*<MENU +18/>*
- Usar bajo su responsabilidad 

° ඬ⃟🔞 _${usedPrefix}video_
° ඬ⃟🔞 _${usedPrefix}imglesbians_
° ඬ⃟🔞 _${usedPrefix}porno_
° ඬ⃟🔞 _${usedPrefix}randomnsfw_
° ඬ⃟🔞 _${usedPrefix}pornogif_
° ඬ⃟🔞 _${usedPrefix}sideboobs_
° ඬ⃟🔞 _${usedPrefix}hentai_
° ඬ⃟🔞 _${usedPrefix}pene_
° ඬ⃟🔞 _${usedPrefix}ecchi_
° ඬ⃟🔞 _${usedPrefix}pussy_
° ඬ⃟🔞 _${usedPrefix}boobs_
° ඬ⃟🔞 _${usedPrefix}panties_
° ඬ⃟🔞 _${usedPrefix}nekogif_
° ඬ⃟🔞 _${usedPrefix}porno2_
° ඬ⃟🔞 _${usedPrefix}yaoi_
° ඬ⃟🔞 _${usedPrefix}yuri_
° ඬ⃟🔞 _${usedPrefix}yaoigif_
° ඬ⃟🔞 _${usedPrefix}yurigif_
° ඬ⃟🔞 _${usedPrefix}pack_
° ඬ⃟🔞 _${usedPrefix}pack2_
° ඬ⃟🔞 _${usedPrefix}pack3_
° ඬ⃟🔞 _${usedPrefix}loli2_
° ඬ⃟🔞 _${usedPrefix}muslos_
° ඬ⃟🔞 _${usedPrefix}htrap_
° ඬ⃟🔞 _${usedPrefix}furro_
° ඬ⃟🔞 _${usedPrefix}nsfwass_
° ඬ⃟🔞 _${usedPrefix}bdsm_
° ඬ⃟🔞 _${usedPrefix}cum_
° ඬ⃟🔞 _${usedPrefix}ero_
° ඬ⃟🔞 _${usedPrefix}femdom_
° ඬ⃟🔞 _${usedPrefix}foot_
° ඬ⃟🔞 _${usedPrefix}glass_
° ඬ⃟🔞 _${usedPrefix}nsfwloli_
`.trim()
    let mentionedJid = [who]
    conn.sendFile(m.chat, pp, 'lp.jpg', str, m, false, { contextInfo: { mentionedJid }})
  }
}
handler.help = ['labiblia']
handler.tags = ['General']
handler.command = /^(labiblia)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
