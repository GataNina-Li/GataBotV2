let fs = require('fs')
let fetch = require('node-fetch')
let moment = require('moment-timezone')
let fakeImage = 'https://i.imgur.com/lcjzety.jpg'
let safusimage = 'https://i.imgur.com/lcjzety.jpg'
let fakeMessage = 'Bruno Sobrino'
const { MessageType } = require('@adiwajshing/baileys')
let path = require('path')
let levelling = require('../lib/levelling')
let handler = async (m, { conn, usedPrefix }) => {
let prep = await conn.prepareMessage(m.chat, fs.readFileSync('./Menu2.jpg'), MessageType.image, {})
let idd = prep.message
let pp = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  try {
    pp = await conn.getProfilePicture(who)
  } catch (e) {

  } finally {
await conn.fakeReply(m.chat, '*「 ⚠️ 」Loading...*', '0@s.whatsapp.net', '*LIST MENU*', 'status@broadcast', { thumbnail: await (await fetch(safusimage)).buffer()})
    let jam = moment.tz('Asia/Kolkata').format('HH')
    var ucapanWaktu = 'Good Morning 🌄'
				if (jam >= '03' && jam <= '10') {
				ucapanWaktu = 'Good Morning 🌄'
				} else if (jam >= '10' && jam <= '13') {
				ucapanWaktu = 'Good Afternoon ☀️'
				} else if (jam >= '13' && jam <= '18') {
				ucapanWaktu = 'Good eavening 🌅'
				} else if (jam >= '18' && jam <= '23') {
				ucapanWaktu = 'Good Night 🌙'
				} else {
				ucapanWaktu = 'Good Night 🌙'
				} 
				   let name = conn.getName(m.sender)
    let d = new Date
    let locale = 'en'
       let { exp, limit, registered, regTime, level, role } = global.DATABASE.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
       let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
  let username = conn.getName(who)
let menu =`
╭══〘 ✯✯✯✯✯✯✯✯ 〙═╮
║═ *𝐓𝐡𝐞 𝐒𝐡𝐚𝐝𝐨𝐰 𝐁𝐫𝐨𝐤𝐞𝐫𝐬 - 𝐁𝐨𝐭*
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡
║➤ *✨𝗛ola, %name!!*
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡
║➤ *Creador del Bot: Bruno Sobrino* 
║➤ *Numero del creador:* *wa.me/17722386341 (No Bot)*
║➤ *PayPal:* *https://www.paypal.me/TheShadowBrokers133*
║➤ *Numero del Bot oficial:* *wa.me/5219991402134*
║➤ *Numero del Sub Bot oficial:* *wa.me/5219992095479*
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡
╰══╡✯✯✯✯✯✯✯✯╞══╯
┏━━━━━━━━━━━━━┓
┃ *<INFORMACIÓN|MENUS/>*
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
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<REPORTA FALLOS EN ALGÚN COMANDO/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ Reporta cualquier comando que falle para poder solucionarlo
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟📬 _${usedPrefix}bug *comando con fallas*_
┣ ඬ⃟📬 _${usedPrefix}report *comando con fallas*_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<UNE UN BOT A TU GRUPO/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟🤖 _${usedPrefix}join *link del grupo*_ 
┣ ඬ⃟🤖 _${usedPrefix}bots_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<TOPS/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟🎖️ _${usedPrefix}top10gays_
┣ ඬ⃟🎖️ _${usedPrefix}toplind@s_
┣ ඬ⃟🎖️ _${usedPrefix}topput@s_
┣ ඬ⃟🎖️ _${usedPrefix}toppajer@s_
┣ ඬ⃟🎖️ _${usedPrefix}topotakus_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<NUMERO DEL CREADOR/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟👻 _${usedPrefix}owner_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<JUEGOS/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟🕹 _${usedPrefix}math *modo*_
┣ ඬ⃟🎮 _${usedPrefix}ttt *nombre del la sala*_
┣ ඬ⃟🕹 _${usedPrefix}delttt *nombre del la sala*_
┣ ඬ⃟🎮 _${usedPrefix}gay2 *yo / @tag*_
┣ ඬ⃟🕹 _${usedPrefix}gay *@tag / nombre*_
┣ ඬ⃟🎮 _${usedPrefix}lesbi *@tag / nombre*_
┣ ඬ⃟🕹 _${usedPrefix}pajero *@tag / nombre*_
┣ ඬ⃟🎮 _${usedPrefix}pajera *@tag / nombre*_
┣ ඬ⃟🕹 _${usedPrefix}puta *@tag / nombre*_
┣ ඬ⃟🎮 _${usedPrefix}puto *@tag / nombre*_
┣ ඬ⃟🕹 _${usedPrefix}rata *@tag / nombre*_
┣ ඬ⃟🎮 _${usedPrefix}manco *@tag / nombre*_
┣ ඬ⃟🕹 _${usedPrefix}manca *@tag / nombre*_
┣ ඬ⃟🎮 _${usedPrefix}formarpareja_
┣ ඬ⃟🕹 _${usedPrefix}dado_
┣ ඬ⃟🎮 _${usedPrefix}simsimi *texto*_
┣ ඬ⃟🕹 _${usedPrefix}formartrio_
┣ ඬ⃟🎮 _${usedPrefix}love *@tag / nombre*_
┣ ඬ⃟🕹 _${usedPrefix}amigorandom_
┣ ඬ⃟🎮 _${usedPrefix}slot *cantidad*_
┣ ඬ⃟🕹 _${usedPrefix}ppt *piedra / papel / tijera*_
┣ ඬ⃟🎮 _${usedPrefix}prostituta *@tag / nombre*_
┣ ඬ⃟🕹 _${usedPrefix}prostituto *@tag / nombre*_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<DESCARGAS/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟📥 _${usedPrefix}imagen *texto*_
┣ ඬ⃟📥 _${usedPrefix}ytsearch *texto*_
┣ ඬ⃟📥 _${usedPrefix}dlaudio *link yt*_
┣ ඬ⃟📥 _${usedPrefix}dlvid *link yt*_
┣ ඬ⃟📥 _${usedPrefix}ytmp3 *link yt*_
┣ ඬ⃟📥 _${usedPrefix}ytmp4 *link yt*_
┣ ඬ⃟📥 _${usedPrefix}play *titulo del audio*_
┣ ඬ⃟📥 _${usedPrefix}play2 *titulo del video*_
┣ ඬ⃟📥 _${usedPrefix}play3 *titulo del audio/video*_
┣ ඬ⃟📥 _${usedPrefix}letra *nombredelacanción*_
┣ ඬ⃟📥 _${usedPrefix}google *texto*_
┣ ඬ⃟📥 _${usedPrefix}googlef *texto*_
┣ ඬ⃟📥 _${usedPrefix}pinterestvideo *link de pinterest*_
┣ ඬ⃟📥 _${usedPrefix}tiktokaudio *link del tiktok*_
┣ ඬ⃟📥 _${usedPrefix}tiktok *link*_
┣ ඬ⃟📥 _${usedPrefix}spotify *autor, cancion*_
┣ ඬ⃟📥 _${usedPrefix}acortar *link*_
┣ ඬ⃟📥 _${usedPrefix}pinterest2 *texto*_
┣ ඬ⃟📥 _${usedPrefix}xnxx *link de xnxx*_
┣ ඬ⃟📥 _${usedPrefix}xnxxsearch *texto*_
┣ ඬ⃟📥 _${usedPrefix}ssweb *link*_
┣ ඬ⃟📥 _${usedPrefix}animeinfo *nombre del anime*_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<GESTION DE GRUPOS/>* 
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟💎 _${usedPrefix}admins *texto*_ 
┣ ඬ⃟💎 _${usedPrefix}añadir *numero*_ (desactivado)
┣ ඬ⃟💎 _${usedPrefix}sacar @tag_ (desactivado)
┣ ඬ⃟💎 _${usedPrefix}save *@tag + nombre de contacto*_
┣ ඬ⃟💎 _${usedPrefix}daradmin *@tag*_
┣ ඬ⃟💎 _${usedPrefix}quitaradmin *@tag*_
┣ ඬ⃟💎 _${usedPrefix}grupo *abierto / cerrado*_
┣ ඬ⃟💎 _${usedPrefix}enable welcome_
┣ ඬ⃟💎 _${usedPrefix}disable welcome_
┣ ඬ⃟💎 _${usedPrefix}enable antilink_
┣ ඬ⃟💎 _${usedPrefix}disable antilink_
┣ ඬ⃟💎 _${usedPrefix}enable antilink2_
┣ ඬ⃟💎 _${usedPrefix}disable antilink2_
┣ ඬ⃟💎 _${usedPrefix}enable delete_
┣ ඬ⃟💎 _${usedPrefix}disable  delete_ 
┣ ඬ⃟💎 _${usedPrefix}link_
┣ ඬ⃟💎 _${usedPrefix}notificar *texto*_
┣ ඬ⃟💎 _${usedPrefix}setname *Nuevo nombre del grupo*_
┣ ඬ⃟💎 _${usedPrefix}setdesc *Nueva descripción del grupo*_
┣ ඬ⃟💎 _${usedPrefix}infogrupo_
┣ ඬ⃟💎 _${usedPrefix}invocar *texto*_
┣ ඬ⃟💎 _${usedPrefix}del *responder a un mensaje del bot*_
┣ ඬ⃟💎 _${usedPrefix}fantasmas_
┣ ඬ⃟💎 _${usedPrefix}banchat_
┣ ඬ⃟💎 _${usedPrefix}unbanchat_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<CREADORES/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟🧧 _${usedPrefix}s_
┣ ඬ⃟🧧 _${usedPrefix}sticker_
┣ ඬ⃟🧧 _${usedPrefix}semoji_
┣ ඬ⃟🧧 _${usedPrefix}wasted_
┣ ඬ⃟🧧 _${usedPrefix}stonks_
┣ ඬ⃟🧧 _${usedPrefix}trash_
┣ ඬ⃟🧧 _${usedPrefix}rainbow_
┣ ඬ⃟🧧 _${usedPrefix}circle_
┣ ඬ⃟🧧 _${usedPrefix}stickermaker_
┣ ඬ⃟🧧 _${usedPrefix}attp *texto*_
┣ ඬ⃟🧧 _${usedPrefix}style *texto*_
┣ ඬ⃟🧧 _${usedPrefix}attp2 *texto*_
┣ ඬ⃟🧧 _${usedPrefix}stickerfilter_
┣ ඬ⃟🧧 _${usedPrefix}mp3 *responde a un video*_
┣ ඬ⃟🧧 _${usedPrefix}img *responde a un sticker*_
┣ ඬ⃟🧧 _${usedPrefix}blur *responde a una imagen*_
┣ ඬ⃟🧧 _${usedPrefix}swm *link de imagen de google*_
┣ ඬ⃟🧧 _${usedPrefix}gif *responde a un sticker/video*_
┣ ඬ⃟🧧 _${usedPrefix}tovideo *responde a una nota de voz*_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<RANDOM|EXTRAS/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
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
┣ ඬ⃟👾 _${usedPrefix}qr *texto*_
┣ ඬ⃟👾 _${usedPrefix}afk *motivo*_
┣ ඬ⃟👾 _${usedPrefix}CristianoRonaldo_
┣ ඬ⃟👾 _${usedPrefix}pregunta *pregunta*_
┣ ඬ⃟👾 _${usedPrefix}mention *texto*_
┣ ඬ⃟👾 _${usedPrefix}spamchat *texto*_
┣ ඬ⃟👾 _${usedPrefix}traducir es *texto*_
┣ ඬ⃟👾 _${usedPrefix}zodiac *AAAA MM DD*_
┣ ඬ⃟👾 _${usedPrefix}readmore *texto1| texto2*_
┣ ඬ⃟👾 _${usedPrefix}calc *expresión matemática*_ 
┣ ඬ⃟👾 _${usedPrefix}spamwa *numero|texto|cantidad*_
┣ ඬ⃟👾 _${usedPrefix}readqr *responde a un código QR*_
┣ ඬ⃟👾 _${usedPrefix}anime *random / waifu / husbu /neko*_
┣ ඬ⃟👾 _${usedPrefix}subirestado *texto / responder video, imagen o gif*_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<COMANDOS +18/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ Usar bajo su responsabilidad 
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟🔞 _${usedPrefix}labiblia_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<EFECTOS PARA NOTAS DE VOZ O AUDIOS/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ Responde a un audio o nota de voz
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
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
┣ ඬ⃟🎤 _${usedPrefix}vibracion *cantidad*_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<AUDIOS/>* 
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟🔊 _${usedPrefix}menu2_
┣ ඬ⃟🔊 _${usedPrefix}menuaudios_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<CHAT ANONIMO/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟📳 _${usedPrefix}start_
┣ ඬ⃟📳 _${usedPrefix}next_
┣ ඬ⃟📳 _${usedPrefix}leave_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<CONVIERTETE EN BOT/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟🏷 _${usedPrefix}stop_
┣ ඬ⃟🏷 _${usedPrefix}jadibot_
┣ ඬ⃟🏷 _${usedPrefix}getcode_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<LOGOS PERSONALIZADOS/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟📝️ _${usedPrefix}lolice_
┣ ඬ⃟📝️ _${usedPrefix}simpcard_
┣ ඬ⃟📝️ _${usedPrefix}hornycard_ 
┣ ඬ⃟📝️ _${usedPrefix}lblackpink_
┣ ඬ⃟📝️ _${usedPrefix}logocorazon_
┣ ඬ⃟📝️ _${usedPrefix}tahta *texto*_
┣ ඬ⃟📝️ _${usedPrefix}nulis *texto*_
┣ ඬ⃟📝️ _${usedPrefix}nulis2 *texto*_
┣ ඬ⃟📝️ _${usedPrefix}lolice *@tag*_
┣ ඬ⃟📝️ _${usedPrefix}logos_ (lista)
┣ ඬ⃟📝️ _${usedPrefix}simpcard *@tag*_
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ *<PROPIETARO DEL BOT/>*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟👑 _${usedPrefix}boost_
┣ ඬ⃟👑 _${usedPrefix}restart_
┣ ඬ⃟👑 _${usedPrefix}banlist_
┣ ඬ⃟👑 _${usedPrefix}virtext1_
┣ ඬ⃟👑 _${usedPrefix}actualizar_
┣ ඬ⃟👑 _${usedPrefix}CajaFuerte_
┣ ඬ⃟👑 _${usedPrefix}bc *texto*_
┣ ඬ⃟👑 _${usedPrefix}bcgc *texto*_
┣ ඬ⃟👑 _${usedPrefix}bcbot *texto*_
┣ ඬ⃟👑 _${usedPrefix}setbye *@tag*_
┣ ඬ⃟👑 _${usedPrefix}banuser *@tag*_
┣ ඬ⃟👑 _${usedPrefix}enable *public*_
┣ ඬ⃟👑 _${usedPrefix}disable *public*_
┣ ඬ⃟👑 _${usedPrefix}unbanuser *@tag*_
┣ ඬ⃟👑 _${usedPrefix}listgroup *@tag*_
┣ ඬ⃟👑 _${usedPrefix}enable *restrict*_
┣ ඬ⃟👑 _${usedPrefix}enable *autoread*_
┣ ඬ⃟👑 _${usedPrefix}setwelcome *@tag*_
┣ ඬ⃟👑 _${usedPrefix}enable *autoread*_
┣ ඬ⃟👑 _${usedPrefix}disable *autoread*_
┗━━━━━━━━━━━━━┛`.trim()
 const buttons = [{buttonId: 'id1', buttonText: {displayText: 'Hola🤖'}, type: 1}, {buttonId: '#donar', buttonText: {displayText: '🔮Donar'}, type: 1}]
  let id = Object.keys(idd)[0]
  const buttonMessage = {[id]: prep.message[id], contentText: menu, footerText: 'The Shadow Brokers - Bot', buttons: buttons, headerType: 'IMAGE'}
  conn.sendMessage(m.chat, buttonMessage, MessageType.buttonsMessage, { quoted: {key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' }, message: { orderMessage: { itemCount: 4349054, status: 999, thumbnail: await (await fetch(safusimage)).buffer(), surface: 999, message: 'тнє ѕнα∂σω вяσкєяѕ - вσт', orderTitle: 'iOfficial', sellerJid: '0@s.whatsapp.net'}}}}, { contextInfo: { mentionedJid: [m.sender]}})
}}
handler.command = /^(2help)$/
handler.fail = null
module.exports = handler
