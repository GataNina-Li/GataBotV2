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
 ‖⇛ 🎳 _${usedPrefix}top10gays | topgay_
 ‖⇛ 🎳 _${usedPrefix}toplind@s | toplind@_
 ‖⇛ 🎳 _${usedPrefix}topput@s | toppt_
 ‖⇛ 🎳 _${usedPrefix}toppajer@s | toppajeros_
 ‖⇛ 🎳 _${usedPrefix}topotakus | toptakus_
 ‖⇛ 🎳 _${usedPrefix}top10integrantes_
 ‖⇛ 🎳 _${usedPrefix}top10shiposters | topshipost_
 ‖⇛ 🎳 _${usedPrefix}top10panafrescos_
 ‖⇛ 🎳 _${usedPrefix}top10lagrasa | top10grasa_
 ‖⇛ 🎳 _${usedPrefix}math | mates | matemáticas *modo*_
 ‖⇛ 🎳 _${usedPrefix}ttt | tictactoe *nombre del la sala*_
 ‖⇛ 🎳 _${usedPrefix}delttt *nombre del la sala*_
 ‖⇛ 🎳 _${usedPrefix}gay2 *@tag*_
 ‖⇛ 🎳 _${usedPrefix}gay2 *yo*_
 ‖⇛ 🎳 _${usedPrefix}gay *@tag / nombre*_
 ‖⇛ 🎳 _${usedPrefix}lesbi *@tag / nombre*_
 ‖⇛ 🎳 _${usedPrefix}pajero *@tag / nombre*_
 ‖⇛ 🎳 _${usedPrefix}pajera *@tag / nombre*_
 ‖⇛ 🎳 _${usedPrefix}puta *@tag / nombre*_
 ‖⇛ 🎳 _${usedPrefix}puto *@tag / nombre*_
 ‖⇛ 🎳 _${usedPrefix}rata *@tag / nombre*_
 ‖⇛ 🎳 _${usedPrefix}manco *@tag / nombre*_
 ‖⇛ 🎳 _${usedPrefix}manca *@tag / nombre*_
 ‖⇛ 🎳 _${usedPrefix}formarpareja | pareja5_
 ‖⇛ 🎳 _${usedPrefix}dado_
 ‖⇛ 🎳 _${usedPrefix}simsimi | simi | bot *texto*_
 ‖⇛ 🎳 _${usedPrefix}formartrio_
 ‖⇛ 🎳 _${usedPrefix}love *@tag / nombre*_
 ‖⇛ 🎳 _${usedPrefix}amigorandom | amigo | amistad_
 ‖⇛ 🎳 _${usedPrefix}slot *cantidad*_
 ‖⇛ 🎳 _${usedPrefix}ppt *piedra / papel / tijera*_
 ‖⇛ 🎳 _${usedPrefix}prostituta *@tag / nombre*_
 ‖⇛ 🎳 _${usedPrefix}prostituto *@tag / nombre*_
 ‖⇛ 🎳 _${usedPrefix}doxxear *@tag*_
 ‖⇛ 🎳 _${usedPrefix}doxxeame_
 ‖ ➥ ⧼ *_MENÚ DE JUEGOS_* ⧽ 
╰━〘 🐈🌟🐈🌟🐈🌟🐈🌟🐈 〙━╯
𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨`.trim()
conn.send3ButtonLoc(m.chat, (await fetch(pp)).buffer(), `
⁖ᯓ፨҈༺ 𝙂𝙖𝙩𝙖𝘽𝙤𝙩 | 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 ༻፨҈ᯓ⁖
`.trim(), menu, '🚀 𝙈𝙀𝙉𝙐 𝘿𝙀 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙎 🚀', `#menudescarga`, '🔐 𝙂𝙀𝙎𝙏𝙄𝙊𝙉 𝘿𝙀 𝙂𝙍𝙐𝙋𝙊 🔐', `#menugrupo`, '🎨 𝙈𝙀𝙉𝙐 𝘿𝙀 𝘾𝙍𝙀𝘼𝘾𝙄𝙊𝙉 🎨', `#menucreador`, m, false, { contextInfo: { mentionedJid }})}

handler.command = /^(menujuego|menujuegos|Menújuego|Menújuegos|menújuegos)$/i
module.exports = handler
