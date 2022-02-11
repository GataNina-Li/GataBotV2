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
╭══〘 ✯✯✯✯✯✯✯✯ 〙═╮
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡
║➤ *✨𝗛ola, ${username}!!*
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡
╰══╡✯✯✯✯✯✯✯✯╞══╯
┏━━━━━━━━━━━━━┓
┃ *<MENU SIMPLE/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟ℹ️️ _${usedPrefix}donar_
┣ ඬ⃟ℹ️️ _${usedPrefix}infobot_
┣ ඬ⃟ℹ️️ _${usedPrefix}grupos_
┣ ඬ⃟ℹ️ _${usedPrefix}instalarbot_
┣ ඬ⃟ℹ️ _${usedPrefix}reglas_
┣ ඬ⃟ℹ️ _${usedPrefix}menusimple_
┣ ඬ⃟ℹ️️ _${usedPrefix}menuaudios_
┣ ඬ⃟ℹ️️ _${usedPrefix}menu2_
┣ ඬ⃟ℹ️️ _${usedPrefix}labiblia_
┣ ඬ⃟ℹ️ _${usedPrefix}estado_
┣ ඬ⃟ℹ️ _¿Qué es un Bot?_
┣ ඬ⃟ℹ️ _Codigos para audios_
┣ ඬ⃟ℹ️ _Términos y condiciones_
┣ ඬ⃟📬 _${usedPrefix}bug_
┣ ඬ⃟📬 _${usedPrefix}report_
┣ ඬ⃟🤖 _${usedPrefix}join_ 
┣ ඬ⃟🤖 _${usedPrefix}bots_
┣ ඬ⃟🎖️ _${usedPrefix}top10gays_
┣ ඬ⃟🎖️ _${usedPrefix}toplind@s_
┣ ඬ⃟🎖️ _${usedPrefix}topput@s_
┣ ඬ⃟🎖️ _${usedPrefix}toppajer@s_
┣ ඬ⃟🎖️ _${usedPrefix}topotakus_
┣ ඬ⃟👻 _${usedPrefix}owner_
┣ ඬ⃟🕹 _${usedPrefix}math_
┣ ඬ⃟🎮 _${usedPrefix}ttt_
┣ ඬ⃟🕹 _${usedPrefix}delttt_
┣ ඬ⃟🎮 _${usedPrefix}gay2_
┣ ඬ⃟🕹 _${usedPrefix}gay_
┣ ඬ⃟🎮 _${usedPrefix}lesbi_
┣ ඬ⃟🕹 _${usedPrefix}pajero_
┣ ඬ⃟🎮 _${usedPrefix}pajera_
┣ ඬ⃟🕹 _${usedPrefix}puta_
┣ ඬ⃟🎮 _${usedPrefix}puto_
┣ ඬ⃟🕹 _${usedPrefix}rata_
┣ ඬ⃟🎮 _${usedPrefix}manco_
┣ ඬ⃟🕹 _${usedPrefix}manca_
┣ ඬ⃟🎮 _${usedPrefix}formarpareja_
┣ ඬ⃟🕹 _${usedPrefix}dado_
┣ ඬ⃟🎮 _${usedPrefix}simsimi_
┣ ඬ⃟🕹 _${usedPrefix}formartrio_
┣ ඬ⃟🎮 _${usedPrefix}love_
┣ ඬ⃟🕹 _${usedPrefix}amigorandom_
┣ ඬ⃟🎮 _${usedPrefix}slot_
┣ ඬ⃟🕹 _${usedPrefix}ppt_
┣ ඬ⃟🎮 _${usedPrefix}prostituta_
┣ ඬ⃟🕹 _${usedPrefix}prostituto_
┣ ඬ⃟📥 _${usedPrefix}imagen_
┣ ඬ⃟📥 _${usedPrefix}ytsearch_
┣ ඬ⃟📥 _${usedPrefix}dlaudio_
┣ ඬ⃟📥 _${usedPrefix}dlvid_
┣ ඬ⃟📥 _${usedPrefix}ytmp3_
┣ ඬ⃟📥 _${usedPrefix}ytmp4_
┣ ඬ⃟📥 _${usedPrefix}play_
┣ ඬ⃟📥 _${usedPrefix}play2_
┣ ඬ⃟📥 _${usedPrefix}play3_
┣ ඬ⃟📥 _${usedPrefix}letra_
┣ ඬ⃟📥 _${usedPrefix}google_
┣ ඬ⃟📥 _${usedPrefix}googlef_
┣ ඬ⃟📥 _${usedPrefix}pinterestvideo_
┣ ඬ⃟📥 _${usedPrefix}tiktokaudio_
┣ ඬ⃟📥 _${usedPrefix}tiktok_
┣ ඬ⃟📥 _${usedPrefix}spotify_
┣ ඬ⃟📥 _${usedPrefix}acortar_
┣ ඬ⃟📥 _${usedPrefix}pinterest2_
┣ ඬ⃟📥 _${usedPrefix}xnxx_
┣ ඬ⃟📥 _${usedPrefix}xnxxsearch_
┣ ඬ⃟📥 _${usedPrefix}ssweb_
┣ ඬ⃟📥 _${usedPrefix}animeinfo_
┣ ඬ⃟💎 _${usedPrefix}admins_ 
┣ ඬ⃟💎 _${usedPrefix}añadir_ 
┣ ඬ⃟💎 _${usedPrefix}sacar_ 
┣ ඬ⃟💎 _${usedPrefix}save_
┣ ඬ⃟💎 _${usedPrefix}daradmin_
┣ ඬ⃟💎 _${usedPrefix}quitaradmin_
┣ ඬ⃟💎 _${usedPrefix}grupo abierto/cerrado_
┣ ඬ⃟💎 _${usedPrefix}enable welcome_
┣ ඬ⃟💎 _${usedPrefix}disable welcome_
┣ ඬ⃟💎 _${usedPrefix}enable antilink_
┣ ඬ⃟💎 _${usedPrefix}disable antilink_
┣ ඬ⃟💎 _${usedPrefix}enable antilink2_
┣ ඬ⃟💎 _${usedPrefix}disable antilink2_
┣ ඬ⃟💎 _${usedPrefix}enable delete_
┣ ඬ⃟💎 _${usedPrefix}disable  delete_ 
┣ ඬ⃟💎 _${usedPrefix}link_
┣ ඬ⃟💎 _${usedPrefix}notificar_
┣ ඬ⃟💎 _${usedPrefix}setname_
┣ ඬ⃟💎 _${usedPrefix}setdesc_
┣ ඬ⃟💎 _${usedPrefix}infogrupo_
┣ ඬ⃟💎 _${usedPrefix}invocar_
┣ ඬ⃟💎 _${usedPrefix}del_
┣ ඬ⃟💎 _${usedPrefix}fantasmas_
┣ ඬ⃟💎 _${usedPrefix}banchat_
┣ ඬ⃟💎 _${usedPrefix}unbanchat_
┣ ඬ⃟🧧 _${usedPrefix}s_
┣ ඬ⃟🧧 _${usedPrefix}sticker_
┣ ඬ⃟🧧 _${usedPrefix}semoji_
┣ ඬ⃟🧧 _${usedPrefix}wasted_
┣ ඬ⃟🧧 _${usedPrefix}stonks_
┣ ඬ⃟🧧 _${usedPrefix}trash_
┣ ඬ⃟🧧 _${usedPrefix}rainbow_
┣ ඬ⃟🧧 _${usedPrefix}circle_
┣ ඬ⃟🧧 _${usedPrefix}stickermaker_
┣ ඬ⃟🧧 _${usedPrefix}attp_
┣ ඬ⃟🧧 _${usedPrefix}style_
┣ ඬ⃟🧧 _${usedPrefix}attp2_
┣ ඬ⃟🧧 _${usedPrefix}stickerfilter_
┣ ඬ⃟🧧 _${usedPrefix}mp3_
┣ ඬ⃟🧧 _${usedPrefix}img_
┣ ඬ⃟🧧 _${usedPrefix}blur_
┣ ඬ⃟🧧 _${usedPrefix}swm_
┣ ඬ⃟🧧 _${usedPrefix}gif_
┣ ඬ⃟🧧 _${usedPrefix}tovideo_
┣ ඬ⃟👾 _${usedPrefix}futbol_
┣ ඬ⃟👾 _${usedPrefix}Messi_
┣ ඬ⃟👾 _${usedPrefix}animal_
┣ ඬ⃟👾 _${usedPrefix}meme_
┣ ඬ⃟👾 _${usedPrefix}meme2_
┣ ඬ⃟👾 _${usedPrefix}meme3_
┣ ඬ⃟👾 _${usedPrefix}cat_
┣ ඬ⃟👾 _${usedPrefix}dog_
┣ ඬ⃟👾 _${usedPrefix}pikachu_
┣ ඬ⃟👾 _${usedPrefix}waifu_
┣ ඬ⃟👾 _${usedPrefix}blackpink_
┣ ඬ⃟👾 _${usedPrefix}reto_
┣ ඬ⃟👾 _${usedPrefix}verdad_
┣ ඬ⃟👾 _${usedPrefix}imagenrandom_
┣ ඬ⃟👾 _${usedPrefix}neko_
┣ ඬ⃟👾 _${usedPrefix}lolivid_
┣ ඬ⃟👾 _${usedPrefix}iqtest_
┣ ඬ⃟👾 _${usedPrefix}kpopitzy_
┣ ඬ⃟👾 _${usedPrefix}navidad_
┣ ඬ⃟👾 _${usedPrefix}loli_
┣ ඬ⃟👾 _${usedPrefix}gawrgura_
┣ ඬ⃟👾 _${usedPrefix}miku_
┣ ඬ⃟👾 _${usedPrefix}nyan_
┣ ඬ⃟👾 _${usedPrefix}pat_
┣ ඬ⃟👾 _${usedPrefix}itachi_
┣ ඬ⃟👾 _${usedPrefix}slap_
┣ ඬ⃟👾️ _${usedPrefix}pat_
┣ ඬ⃟👾 _${usedPrefix}perfil_
┣ ඬ⃟👾 _${usedPrefix}scan_
┣ ඬ⃟👾 _${usedPrefix}kpop_
┣ ඬ⃟👾 _${usedPrefix}qr_
┣ ඬ⃟👾 _${usedPrefix}afk_
┣ ඬ⃟👾 _${usedPrefix}CristianoRonaldo_
┣ ඬ⃟👾 _${usedPrefix}pregunta_
┣ ඬ⃟👾 _${usedPrefix}mention_
┣ ඬ⃟👾 _${usedPrefix}spamchat_
┣ ඬ⃟👾 _${usedPrefix}traducir es_
┣ ඬ⃟👾 _${usedPrefix}zodiac_
┣ ඬ⃟👾 _${usedPrefix}readmore_
┣ ඬ⃟👾 _${usedPrefix}calc_ 
┣ ඬ⃟👾 _${usedPrefix}spamwa_
┣ ඬ⃟👾 _${usedPrefix}readqr_
┣ ඬ⃟👾 _${usedPrefix}anime_
┣ ඬ⃟👾 _${usedPrefix}subirestado_
┣ ඬ⃟🔞 _${usedPrefix}labiblia_
┣ ඬ⃟🎤 _${usedPrefix}bass_
┣ ඬ⃟🎤 _${usedPrefix}deep_
┣ ඬ⃟🎤 _${usedPrefix}earrape_
┣ ඬ⃟🎤 _${usedPrefix}fast_
┣ ඬ⃟🎤 _${usedPrefix}fat_
┣ ඬ⃟🎤 _${usedPrefix}nightcore_
┣ ඬ⃟🎤 _${usedPrefix}reverse_
┣ ඬ⃟🎤 _${usedPrefix}robot_
┣ ඬ⃟🎤 _${usedPrefix}slow_
┣ ඬ⃟🎤 _${usedPrefix}smooth_
┣ ඬ⃟🎤 _${usedPrefix}vibracion_
┣ ඬ⃟🔊 _${usedPrefix}menu2_
┣ ඬ⃟🔊 _${usedPrefix}menuaudios_
┣ ඬ⃟📳 _${usedPrefix}start_
┣ ඬ⃟📳 _${usedPrefix}next_
┣ ඬ⃟📳 _${usedPrefix}leave_
┣ ඬ⃟🏷 _${usedPrefix}stop_
┣ ඬ⃟🏷 _${usedPrefix}jadibot_
┣ ඬ⃟🏷 _${usedPrefix}getcode_
┣ ඬ⃟📝️ _${usedPrefix}lolice_
┣ ඬ⃟📝️ _${usedPrefix}simpcard_
┣ ඬ⃟📝️ _${usedPrefix}hornycard_ 
┣ ඬ⃟📝️ _${usedPrefix}lblackpink_
┣ ඬ⃟📝️ _${usedPrefix}logocorazon_
┣ ඬ⃟📝️ _${usedPrefix}tahta_
┣ ඬ⃟📝️ _${usedPrefix}nulis_
┣ ඬ⃟📝️ _${usedPrefix}nulis2_
┣ ඬ⃟📝️ _${usedPrefix}lolice_
┣ ඬ⃟📝️ _${usedPrefix}logos_ 
┣ ඬ⃟📝️ _${usedPrefix}simpcard_
┗━━━━━━━━━━━━━┛
`.trim()
    let mentionedJid = [who]
    conn.sendFile(m.chat, pp, 'lp.jpg', str, m, false, { contextInfo: { mentionedJid }})
  }
}
handler.help = ['menusimple']
handler.tags = ['General']
handler.command = /^(menusimple)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
