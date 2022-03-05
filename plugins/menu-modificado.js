let handler = async (m, { conn, command, text, usedPrefix }) => {
let fetch = require('node-fetch')
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let pp = 'https://i.imgur.com/BfsbCOR.jpg'
let menu =`
╭══〘 🐈⚡️🐈⚡️🐈⚡️🐈 〙══╮
║═ 𝙂𝙖𝙩𝙖𝘽𝙤𝙩 | 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
║❇️ *¡𝗛ola! ${username}* ❇️
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
║🔰 *Creadora/Editora: Gata Dios* 
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
╰══〘 🐈⚡️🐈⚡️🐈⚡️🐈 〙══╯
┏━━━━━━━━━━━━━━━━━━┓
┃ *INFORMACIÓN|MENUS*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠⚜️ _${usedPrefix}donar_
┣ ↠⚜️ _${usedPrefix}creditos_
┣ ↠⚜️ _${usedPrefix}infobot_
┣ ↠⚜️ _${usedPrefix}grupos_
┣ ↠⚜️ _${usedPrefix}reglas_
┣ ↠⚜️ _${usedPrefix}menuaudios_
┣ ↠⚜️ _${usedPrefix}menu2_
┣ ↠⚜️ _${usedPrefix}estado_
┣ ↠⚜️ _¿Qué es un Bot?_
┣ ↠⚜️ _Codigos para audios_
┣ ↠⚜️ _Términos y condiciones_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *OBTENER A GATABOT*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🛎 _${usedPrefix}instalarbot_
┣ ↠🛎 _${usedPrefix}procesobot_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *REPORTA FALLOS DE COMANDOS*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ *Reporta cualquier comando que falle*   
┃ *para poder solucionarlo*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠📮 _${usedPrefix}bug *tal comando con fallas*_
┣ ↠📮 _${usedPrefix}report *tal comando con fallas*_
┣ ↠📮 _${usedPrefix}reporte *tal comando con fallas*_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *NÚMERO DEl PROPIETARIO/A*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🐈 _${usedPrefix}owner_
┣ ↠🐈 _${usedPrefix}contacto_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *UNE UN BOT A TU GRUPO*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🤖 _${usedPrefix}join *enlace del grupo*_
┣ ↠🤖 _${usedPrefix}unete *enlace del grupo*_ 
┣ ↠🤖 _${usedPrefix}bots *ver bots*_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *TOPS*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🎖️ _${usedPrefix}top10gays | topgay_
┣ ↠🎖️ _${usedPrefix}toplind@s | toplind@_
┣ ↠🎖️ _${usedPrefix}topput@s | toppt_
┣ ↠🎖️ _${usedPrefix}toppajer@s | toppajeros_
┣ ↠🎖️ _${usedPrefix}topotakus | toptakus_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *JUEGOS*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🧩 _${usedPrefix}math | mates | matemáticas *modo*_
┣ ↠👾 _${usedPrefix}ttt | tictactoe *nombre del la sala*_
┣ ↠🧩 _${usedPrefix}delttt *nombre del la sala*_
┣ ↠👾 _${usedPrefix}gay2 *@tag*_
┣ ↠👾 _${usedPrefix}gay2 *yo*_
┣ ↠🧩 _${usedPrefix}gay *@tag / nombre*_
┣ ↠👾 _${usedPrefix}lesbi *@tag / nombre*_
┣ ↠🧩 _${usedPrefix}pajero *@tag / nombre*_
┣ ↠👾 _${usedPrefix}pajera *@tag / nombre*_
┣ ↠🧩 _${usedPrefix}puta *@tag / nombre*_
┣ ↠👾 _${usedPrefix}puto *@tag / nombre*_
┣ ↠🧩 _${usedPrefix}rata *@tag / nombre*_
┣ ↠👾 _${usedPrefix}manco *@tag / nombre*_
┣ ↠🧩 _${usedPrefix}manca *@tag / nombre*_
┣ ↠👾 _${usedPrefix}formarpareja | pareja5_
┣ ↠🧩 _${usedPrefix}dado_
┣ ↠👾 _${usedPrefix}simsimi | simi | bot *texto*_
┣ ↠🧩 _${usedPrefix}formartrio_
┣ ↠👾 _${usedPrefix}love *@tag / nombre*_
┣ ↠🧩 _${usedPrefix}amigorandom | amigo | amistad_
┣ ↠👾 _${usedPrefix}slot *cantidad*_
┣ ↠🧩 _${usedPrefix}ppt *piedra / papel / tijera*_
┣ ↠👾 _${usedPrefix}prostituta *@tag / nombre*_
┣ ↠🧩 _${usedPrefix}prostituto *@tag / nombre*_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *DESCARGAS*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠☀️ _${usedPrefix}imagen | image | gimage *texto*_
┣ ↠❄️ _${usedPrefix}ytsearch *texto*_
┣ ↠☀️ _${usedPrefix}dlaudio *link yt*_
┣ ↠❄️ _${usedPrefix}dlvid *link yt*_
┣ ↠☀️ _${usedPrefix}ytmp3 *link yt*_
┣ ↠❄️ _${usedPrefix}ytmp4 *link yt*_
┣ ↠☀️ _${usedPrefix}play *titulo del audio*_
┣ ↠❄️ _${usedPrefix}play2 *titulo del video*_
┣ ↠☀️ _${usedPrefix}play3 *titulo del audio/video*_
┣ ↠❄️ _${usedPrefix}letra *nombredelacanción*_
┣ ↠☀️ _${usedPrefix}google *texto*_
┣ ↠❄️ _${usedPrefix}googlef *texto*_
┣ ↠☀️ _${usedPrefix}pinterestvideo | pintvid *linkPinterest*_
┣ ↠❄️ _${usedPrefix}tiktokaudio *link del tiktok*_
┣ ↠☀️ _${usedPrefix}tiktok *link*_
┣ ↠❄️ _${usedPrefix}tiktok2 | Tiktok2 *link del tiktok*_
┣ ↠☀️ _${usedPrefix}acortar | reducir *link*_
┣ ↠❄️ _${usedPrefix}pinterest | pinterest2 *texto*_
┣ ↠☀️ _${usedPrefix}ssweb | capturar | captura *link*_
┣ ↠❄️ _${usedPrefix}animeinfo *nombre del anime*_
┣ ↠☀️ _${usedPrefix}wpanime | fondoanime_
┣ ↠❄️ _${usedPrefix}verinstagram | verig |igver *usuario*_
┣ ↠☀️ _${usedPrefix}ighistorias|historiasig *usuario*_
┣ ↠❄️ _${usedPrefix}twittervideo | twvid *link de twitter*_
┣ ↠☀️ _${usedPrefix}wikipedia | wiki | internet *texto*_
┣ ↠❄️ _${usedPrefix}spotify | spotimusica *autor, cancion*_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *GESTION DE GRUPOS* 
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🔐 _${usedPrefix}admins *texto*_ 
┣ ↠🔒 _${usedPrefix}añadir *numero*_ (desactivado)
┣ ↠🔐 _${usedPrefix}sacar @tag_ (desactivado)
┣ ↠🔒 _${usedPrefix}save *@tag + nombre de contacto*_
┣ ↠🔐 _${usedPrefix}daradmin | darpoder *@tag*_
┣ ↠🔒 _${usedPrefix}quitaradmin | quitarpoder *@tag*_
┣ ↠🔐 _${usedPrefix}grupo *abierto / cerrado*_
┣ ↠🔒 _${usedPrefix}enable welcome_
┣ ↠🔐 _${usedPrefix}disable welcome_
┣ ↠🔒 _${usedPrefix}enable antilink_ *(WhatsApp)*
┣ ↠🔐 _${usedPrefix}disable antilink_ 
┣ ↠🔒 _${usedPrefix}enable antilink2_ *(https:)*
┣ ↠🔐 _${usedPrefix}disable antilink2_
┣ ↠🔒 _${usedPrefix}enable delete_
┣ ↠🔐 _${usedPrefix}disable  delete_ 
┣ ↠🔒 _${usedPrefix}link_
┣ ↠🔐 _${usedPrefix}notificar | hidetag *texto*_
┣ ↠🔒 _${usedPrefix}setname *Nuevo nombre del grupo*_
┣ ↠🔐 _${usedPrefix}setdesc *Nueva descripción grupo*_
┣ ↠🔒 _${usedPrefix}infogrupo_
┣ ↠🔐 _${usedPrefix}invocar *texto*_
┣ ↠🔒 _${usedPrefix}del *responder a un mensaje del bot*_
┣ ↠🔐 _${usedPrefix}fantasmas_
┣ ↠🔒 _${usedPrefix}banchat_
┣ ↠🔐 _${usedPrefix}unbanchat_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *CREADORES*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🎨 _${usedPrefix}s_
┣ ↠🎨 _${usedPrefix}sticker_
┣ ↠🎨 _${usedPrefix}semoji | emoji_
┣ ↠🎨 _${usedPrefix}wasted_
┣ ↠🎨 _${usedPrefix}stonks_
┣ ↠🎨 _${usedPrefix}trash *Responda a una foto*_
┣ ↠🎨 _${usedPrefix}sgay *Responda a una foto*_
┣ ↠🎨 _${usedPrefix}circle *Responda a una foto*_
┣ ↠🎨 _${usedPrefix}stickermaker_
┣ ↠🎨 _${usedPrefix}attp *texto*_
┣ ↠🎨 _${usedPrefix}attp2 | s1 | sa *texto*_
┣ ↠🎨 _${usedPrefix}stickerfilter | cs2_
┣ ↠🎨 _${usedPrefix}tomp3 | mp3 *responde a un video*_
┣ ↠🎨 _${usedPrefix}toimg | img *responde a un sticker*_
┣ ↠🎨 _${usedPrefix}togif | gif *responde a sticker/video*_
┣ ↠🎨 _${usedPrefix}ytcomentario | ytcomentar *texto*_
┣ ↠🎨 _${usedPrefix}blur *responde a una imagen*_
┣ ↠🎨 _${usedPrefix}jaal *Responda a una foto*_
┣ ↠🎨 _${usedPrefix}swm *imagen | video | gif*_
┣ ↠🎨 _${usedPrefix}tovideo *responde a una nota de voz*_
┣ ↠🎨 _${usedPrefix}wanted *Responda a una foto*_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *ESTILOS DE TEXTOS*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ *¡Una gran variedad de estilos de textos!*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🪄 _${usedPrefix}style *texto*_
┣ ↠🪄 _${usedPrefix}estilo *texto*_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *SUBIR ESTADOS A GATABOT*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ *¡Sube estados a la cuenta de GataBot!*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠📸 _${usedPrefix}subirestado *texto / video|imagen*_
┣ ↠📸 _${usedPrefix}subirestado *texto / gif*_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *RANDOM|EXTRAS*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🎯 _${usedPrefix}randomwallpaper_
┣ ↠🎲 _${usedPrefix}compartirfoto_
┣ ↠🎳 _${usedPrefix}futbol_
┣ ↠🎯 _${usedPrefix}Messi_
┣ ↠🎲 _${usedPrefix}animal_
┣ ↠🎳 _${usedPrefix}meme_
┣ ↠🎯 _${usedPrefix}meme2_
┣ ↠🎲 _${usedPrefix}meme3_
┣ ↠🎳 _${usedPrefix}cat | gato | gata_
┣ ↠🎯 _${usedPrefix}dog | perro | perra_
┣ ↠🎲 _${usedPrefix}pikachu_
┣ ↠🎳 _${usedPrefix}waifu_
┣ ↠🎯 _${usedPrefix}blackpink_
┣ ↠🎲 _${usedPrefix}reto_
┣ ↠🎳 _${usedPrefix}verdad_
┣ ↠🎯 _${usedPrefix}imagenrandom | random | epico_
┣ ↠🎲 _${usedPrefix}neko_
┣ ↠🎳 _${usedPrefix}lolivid_
┣ ↠🎯 _${usedPrefix}iqtest | iq | inteligencia_
┣ ↠🎲 _${usedPrefix}kpopitzy_
┣ ↠🎳 _${usedPrefix}navidad_
┣ ↠🎯 _${usedPrefix}loli_
┣ ↠🎲 _${usedPrefix}gawrgura_
┣ ↠🎳 _${usedPrefix}miku_
┣ ↠🎯 _${usedPrefix}nyan_
┣ ↠🎲 _${usedPrefix}pat_
┣ ↠🎳 _${usedPrefix}itachi_
┣ ↠🎯 _${usedPrefix}slap_
┣ ↠🎲 _${usedPrefix}pat_
┣ ↠🎳 _${usedPrefix}perfil_
┣ ↠🎯 _${usedPrefix}scan | datos | escaneo_
┣ ↠🎲 _${usedPrefix}kpop_
┣ ↠🎳 _${usedPrefix}qr *texto*_
┣ ↠🎯 _${usedPrefix}afk | aviso | informo *motivo*_
┣ ↠🎲 _${usedPrefix}CristianoRonaldo_
┣ ↠🎳 _${usedPrefix}pregunta *pregunta*_
┣ ↠🎯 _${usedPrefix}mention | mensaje *texto*_
┣ ↠🎲 _${usedPrefix}spamchat *texto*_
┣ ↠🎳 _${usedPrefix}traducir es *texto*_
┣ ↠🎯 _${usedPrefix}zodiac | zodiaco *AAAA MM DD*_
┣ ↠🎲 _${usedPrefix}readmore | leermas *texto1| texto2*_
┣ ↠🎳 _${usedPrefix}calc | calculadora *expresión mat.*_ 
┣ ↠🎯 _${usedPrefix}spamwa *numero|texto|cantidad*_
┣ ↠🎲 _${usedPrefix}readqr *responde a un código QR*_
┣ ↠🎳 _${usedPrefix}anime *random / waifu / husbu /neko*_
┣ ↠🎯 _${usedPrefix}agendar *@tag + nombre contacto*_
┣ ↠🎲 _${usedPrefix}guardar *@tag + nombre contacto*_
┣ ↠🎳 _${usedPrefix}spam *numero|texto|cantidad*_ 
┣ ↠🎯 _${usedPrefix}spoiler | hidetext *texto1| texto2*_
┣ ↠🎲 _${usedPrefix}experiencia | exp
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *COMANDOS +18*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ *Usalo si el grupo te lo permite*
┃ *NO nos hacemos responsables*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🔞 _${usedPrefix}labiblia_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *EFECTOS PARA AUDIOS*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ *Responde a un audio o nota de voz*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🎤 _${usedPrefix}bass_
┣ ↠🎤 _${usedPrefix}deep_
┣ ↠🎤 _${usedPrefix}earrape_
┣ ↠🎤 _${usedPrefix}fast_
┣ ↠🎤 _${usedPrefix}fat_
┣ ↠🎤 _${usedPrefix}nightcore_
┣ ↠🎤 _${usedPrefix}reverse_
┣ ↠🎤 _${usedPrefix}robot_
┣ ↠🎤 _${usedPrefix}slow_
┣ ↠🎤 _${usedPrefix}tupai
┣ ↠🎤 _${usedPrefix}smooth_
┣ ↠🎤 _${usedPrefix}blown_
┣ ↠🎤 _${usedPrefix}vibracion *cantidad*_
┣ ↠🎤 _${usedPrefix}tovn *audio a nota de voz*
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *AUDIOS|MENU* 
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🔊 _${usedPrefix}menu2_
┣ ↠🔊 _${usedPrefix}menuaudios_
┣ ↠🔊 _${usedPrefix}audios_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *CAJA DE ALMACENAMIENTO* 
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠📦 _${usedPrefix}caja_
┣ ↠📦 _${usedPrefix}almacen_
┣ ↠📦 _${usedPrefix}cjalmacen_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *CHAT ANONIMO*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┃ *¡Escribe con alguien de forma anónima!* 
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠👤 _${usedPrefix}chatanonimo | anonimochat_
┣ ↠👤 _${usedPrefix}anonimoch_
┣ ↠👤 _${usedPrefix}start_
┣ ↠👤 _${usedPrefix}next_
┣ ↠👤 _${usedPrefix}leave_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *CONVIERTETE EN BOT*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠❇️ _${usedPrefix}stop_
┣ ↠❇️ _${usedPrefix}jadibot | serbot_
┣ ↠❇️ _${usedPrefix}getcode_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *LOGOS PERSONALIZADOS*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🪅 _${usedPrefix}lolice_
┣ ↠🎀 _${usedPrefix}simpcard_
┣ ↠🪅 _${usedPrefix}hornycard_ 
┣ ↠🎀 _${usedPrefix}lblackpink_
┣ ↠🪅 _${usedPrefix}logocorazon_
┣ ↠🎀 _${usedPrefix}tahta *texto*_
┣ ↠🪅 _${usedPrefix}nulis | notas *texto*_
┣ ↠🎀 _${usedPrefix}nulis2 | notas2 *texto*_
┣ ↠🪅 _${usedPrefix}lolice *@tag*_
┣ ↠🪅 _${usedPrefix}simpcard *@tag*_
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *LISTA DE LOGOS PERSONALIZADOS*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠🔮 _${usedPrefix}logos_ *(lista)*
┗━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
┃ *PROPIETARIO/A DEL BOT*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ↠👑 _${usedPrefix}boost | acelerar_
┣ ↠💎 _${usedPrefix}restart_
┣ ↠👑 _${usedPrefix}banlist_
┣ ↠💎 _${usedPrefix}virtext1 | traba1_
┣ ↠👑 _${usedPrefix}actualizar | update_
┣ ↠👑 _${usedPrefix}bc *texto*_
┣ ↠💎 _${usedPrefix}bcgc *texto*_
┣ ↠👑 _${usedPrefix}bcbot *texto*_
┣ ↠💎 _${usedPrefix}setbye *@tag*_
┣ ↠👑 _${usedPrefix}banuser *@tag*_
┣ ↠💎 _${usedPrefix}enable *public*_
┣ ↠👑 _${usedPrefix}disable *public*_
┣ ↠💎 _${usedPrefix}unbanuser *@tag*_
┣ ↠👑 _${usedPrefix}listgroup_
┣ ↠💎 _${usedPrefix}enable *restrict*_
┣ ↠👑 _${usedPrefix}enable *autoread*_
┣ ↠💎 _${usedPrefix}setwelcome *@tag*_
┣ ↠👑 _${usedPrefix}enable *autoread*_
┣ ↠💎 _${usedPrefix}disable *autoread*_
┣ ↠👑 _${usedPrefix}bcbot *texto*_
┣ ↠💎 _${usedPrefix}bcgc *texto*_
┗━━━━━━━━━━━━━━━━━━┛
𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨`.trim()
conn.send3ButtonLoc(m.chat, (await fetch(pp)).buffer(), `
⁖ᯓ፨҈༺ 𝙂𝙖𝙩𝙖𝘽𝙤𝙩 | 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 ༻፨҈ᯓ⁖
`.trim(), menu, '!𝙃𝙊𝙇𝘼! 😸', `Hola`, '𝙈𝙀𝙉𝙐 𝘿𝙀 𝘼𝙐𝘿𝙄𝙊𝙎 🔊', `#menuaudios`, '𝙈𝙀𝙉𝙐 𝙉𝙐𝙀𝙑𝙊 ⚡️', `#menu`, m, false, { contextInfo: { mentionedJid }})}
handler.command = /^prueba?$/i
module.exports = handler
