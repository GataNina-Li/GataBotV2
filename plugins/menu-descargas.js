//let vn = './media/mariana.mp3'
//NO MODIFIQUES EL NÚMERO DE LA CREADORA NI EL NOMBRE.. SOLO AGREGA LA INFORMACIÓN QUE TU QUIERAS O EDITALO A TU MANERA PERO DEJANDO LOS CREDITOS
//PUEDES AGREGAR OTRA FILAS DE PAYPAL, GRUPOS, PERO DEJA ALGUNOS CREDITOS, YA QUE ES LA UNICA MANERA DE INGRESOS DEL BOT

//SI VAS A MODIFICAR TODO Y HACER PASAR COMO SI FUERA TU BOT (CREADO POR TI) SOLO TE PIDO QUE SI ESTA EN TUS POSIBILIDADES DONES UN POCO
let handler = async (m, { conn, command, text, usedPrefix }) => {
let fetch = require('node-fetch')
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let pp = 'https://i.imgur.com/BfsbCOR.jpg'
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
 ‖⇛ 🚀 _${usedPrefix}play6 *artista y titulo*_
 ‖⇛ 🚀 _${usedPrefix}letra *nombredelacanción*_
 ‖⇛ 🚀 _${usedPrefix}google *texto*_
 ‖⇛ 🚀 _${usedPrefix}googlef *texto*_
 ‖⇛ 🚀 _${usedPrefix}pinterestvideo | pintvid *link*_
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
 ‖⇛ 🚀 _${usedPrefix}frase *escriba un número (1 - 99)*_
 ‖⇛ 🚀 _${usedPrefix}wpaesthetic | fondoaesthetic_
 ‖ ➥ ⧼ *_MENÚ DE DESCARGAS_* ⧽  
╰━〘 🐈🌟🐈🌟🐈🌟🐈🌟🐈 〙━╯
𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨`.trim()
conn.send3ButtonLoc(m.chat, (await fetch(pp)).buffer(), `
⁖ᯓ፨҈༺ 𝙂𝙖𝙩𝙖𝘽𝙤𝙩 | 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 ༻፨҈ᯓ⁖
`.trim(), menu, '🔐 𝙂𝙀𝙎𝙏𝙄𝙊𝙉 𝘿𝙀 𝙂𝙍𝙐𝙋𝙊 🔐', `#menugrupo`, '🎨 𝙈𝙀𝙉𝙐 𝘿𝙀 𝘾𝙍𝙀𝘼𝘾𝙄𝙊𝙉 🎨', `#menucreador`, '💥 𝘼𝙉𝙄𝙈𝙀/𝙍𝘼𝙉𝘿𝙊𝙈 💥', `#menurandom`, m, false, { contextInfo: { mentionedJid }})}

handler.command = /^(menudescarga|menudescargas|Menudescargas|Menúdescargas|Menúdescarga|menúdescarga)$/i
module.exports = handler
