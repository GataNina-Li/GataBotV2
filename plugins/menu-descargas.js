let fs = require('fs')
let fetch = require('node-fetch')
let moment = require('moment-timezone')
let path = require('path')
let util = require('util')
let handler = async (m, { conn, usedPrefix }) => {
let pp = './Menu2.jpg'
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let username = conn.getName(who)
//let vn = './media/mariana.mp3'
//NO MODIFIQUES EL NÚMERO DE LA CREADORA NI EL NOMBRE.. SOLO AGREGA LA INFORMACIÓN QUE TU QUIERAS O EDITALO A TU MANERA PERO DEJANDO LOS CREDITOS
//PUEDES AGREGAR OTRA FILAS DE PAYPAL, GRUPOS, PERO DEJA ALGUNOS CREDITOS, YA QUE ES LA UNICA MANERA DE INGRESOS DEL BOT

//SI VAS A MODIFICAR TODO Y HACER PASAR COMO SI FUERA TU BOT (CREADO POR TI) SOLO TE PIDO QUE SI ESTA EN TUS POSIBILIDADES DONES UN POCO
let menu =`
╭━〘 🐈⚡️🐈⚡️🐈⚡️🐈⚡️🐈 〙━╮
 ‖ ֎┉┉┉⊰ 𝙂𝙖𝙩𝙖𝘽𝙤𝙩 | 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 ⊱┉┉┉֍
 ‖ 💖 *¡𝗛ola! ${username}* 💖
 ‖    ֎┉┉┉┉┉┉⊰ 🌟 ⊱┉┉┉┉┉┉┉֍
 ‖
 ‖⇛ 🚀 _${usedPrefix}imagen | image | gimage *texto*_
 ‖⇛ 🚀 _${usedPrefix}ytsearch *texto*_
 ‖⇛ 🚀 _${usedPrefix}dlaudio *link yt*_
 ‖⇛ 🚀 _${usedPrefix}dlvid *link yt*_
 ‖⇛ 🚀 _${usedPrefix}ytmp3 *link yt*_
 ‖⇛ 🚀 _${usedPrefix}ytmp4 *link yt*_
 ‖⇛ 🚀 _${usedPrefix}play *titulo del audio*_
 ‖⇛ 🚀 _${usedPrefix}play2 *titulo del video*_
 ‖⇛ 🚀 _${usedPrefix}play3 *titulo del audio/video*_
 ‖⇛ 🚀 _${usedPrefix}letra *nombredelacanción*_
 ‖⇛ 🚀 _${usedPrefix}google *texto*_
 ‖⇛ 🚀 _${usedPrefix}googlef *texto*_
 ‖⇛ 🚀 _${usedPrefix}pinterestvideo | pintvid *linkPinterest*_
 ‖⇛ 🚀 _${usedPrefix}tiktokaudio *link del tiktok*_
 ‖⇛ 🚀 _${usedPrefix}tiktok *link*_
 ‖⇛ 🚀 _${usedPrefix}tiktok2 | Tiktok2 *link del tiktok*_
 ‖⇛ 🚀 _${usedPrefix}acortar | reducir *link*_
 ‖⇛ 🚀 _${usedPrefix}pinterest | pinterest2 *texto*_
 ‖⇛ 🚀 _${usedPrefix}ssweb | capturar | captura *link*_
 ‖⇛ 🚀 _${usedPrefix}animeinfo *nombre del anime*_
 ‖⇛ 🚀 _${usedPrefix}wpanime | fondoanime_
 ‖⇛ 🚀 _${usedPrefix}verinstagram | verig |igver *usuario*_
 ‖⇛ 🚀 _${usedPrefix}ighistorias|historiasig *usuario*_
 ‖⇛ 🚀 _${usedPrefix}twittervideo | twvid *link de twitter*_
 ‖⇛ 🚀 _${usedPrefix}wikipedia | wiki | internet *texto*_
 ‖⇛ 🚀 _${usedPrefix}spotify | spotimusica *autor, cancion*_
 ‖ ➥ ⧼ *_MENÚ DE DESCARGAS_* ⧽ 
╰━〘 🐈🌟🐈🌟🐈🌟🐈🌟🐈 〙━╯
`.trim()
let mentionedJid = [who]
conn.send3ButtonImg(m.chat, pp, menu, '𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨', 'Hola 😸', `Hola`, 'Menú de Audios 🔊', `#menuaudios`, 'Menú simple ⚡️', `#menusimple`, m, false, { contextInfo: { mentionedJid }})   
}

handler.command = /^(menudescarga|menudescargas|Menudescargas|Menúdescargas|Menúdescarga|menúdescarga)$/i
handler.fail = null
module.exports = handler
