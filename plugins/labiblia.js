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
┏━━━━━━━━━━━━━━━━━━┓    
┃ *Hola ${username}, aqui tienes el menu +18*
┃ *Usar bajo su responsabilidad*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ *MENU +18*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ 🔥 *IMÁGENES* 🔥
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃»🔞 _${usedPrefix}imglesbians | imagenlesbians_
┃»🔞 _${usedPrefix}porno_
┃»🔞 _${usedPrefix}randomnsfw | nsfw_
┃»🔞 _${usedPrefix}sideboobs | pechos_
┃»🔞 _${usedPrefix}hentai_
┃»🔞 _${usedPrefix}pene_
┃»🔞 _${usedPrefix}ecchi_
┃»🔞 _${usedPrefix}pussy_
┃»🔞 _${usedPrefix}boobs_
┃»🔞 _${usedPrefix}panties_
┃»🔞 _${usedPrefix}yaoi_
┃»🔞 _${usedPrefix}yuri_
┃»🔞 _${usedPrefix}pack_
┃»🔞 _${usedPrefix}pack2_
┃»🔞 _${usedPrefix}pack3_
┃»🔞 _${usedPrefix}loli2_
┃»🔞 _${usedPrefix}muslos_
┃»🔞 _${usedPrefix}muslitos_
┃»🔞 _${usedPrefix}booty_
┃»🔞 _${usedPrefix}culo_
┃»🔞 _${usedPrefix}htrap | trapito_
┃»🔞 _${usedPrefix}furro | furry_
┃»🔞 _${usedPrefix}orgy | orgia_
┃»🔞 _${usedPrefix}nsfwass_
┃»🔞 _${usedPrefix}nsfwbdsm | bdsm_
┃»🔞 _${usedPrefix}nsfwcum | cum_
┃»🔞 _${usedPrefix}nsfwero | ero_
┃»🔞 _${usedPrefix}nsfwfemdom | femdom_
┃»🔞 _${usedPrefix}nsfwfoot | foot_
┃»🔞 _${usedPrefix}nsfwglass | glass_
┃»🔞 _${usedPrefix}nsfwloli_
┃»🔞 _${usedPrefix}xnxxsearch *texto*_
┃»🔞 _${usedPrefix}xnxx *link de xnxx*_
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ 🔥 *GIF-STICKERS* 🔥
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃»🔞 _${usedPrefix}pornogif_
┃»🔞 _${usedPrefix}porno2_
┃»🔞 _${usedPrefix}nekogif_
┃»🔞 _${usedPrefix}yurigif_
┃»🔞 _${usedPrefix}yaoigif_
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ 🔥 *VÍDEOS* 🔥
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃»🔞 _${usedPrefix}video_
┃»🔞 _${usedPrefix}pornovideo | pornovid_
┃»🔞 _${usedPrefix}pornovidgay | pornogayv_
┃»🔞 _${usedPrefix}pornolesbivid | pornolesbiv_
┃»🔞 _${usedPrefix}pornobisexualvid | pornobiv_
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ 🔥 *PREMIUM* 🔥
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ *Usar bajo su responsabilidad* 
┃ *Vídeos +18 aleatorios*
┃ *Puede tardar en enviar*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃»🔞 _${usedPrefix}pornopremium_
┗━━━━━━━━━━━━━━━━━━┛
`.trim()
    let mentionedJid = [who]
    conn.sendFile(m.chat, pp, 'lp.jpg', str, m, false, { contextInfo: { mentionedJid }})
  }
}
handler.help = ['labiblia']
handler.tags = ['General']
handler.command = /^(labiblia|Labiblia|menu18|Menu18|Menú18)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
