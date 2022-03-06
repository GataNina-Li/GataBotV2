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
 ‖⇛ 🔮 _${usedPrefix}logos_ *(lista)*
 ‖⇛ 💮 _${usedPrefix}cementerio | logocementerio_
 ‖⇛ 💮 _${usedPrefix}cesped | logocesped_
 ‖⇛ 💮 _${usedPrefix}coffe | logocoffe_
 ‖⇛ 💮 _${usedPrefix}fire | logofire_
 ‖⇛ 💮 _${usedPrefix}flaming | logoflaming_
 ‖⇛ 💮 _${usedPrefix}lovemessages | lovemensajes_
 ‖⇛ 💮 _${usedPrefix}playa | logoplaya_
 ‖⇛ 💮 _${usedPrefix}logorandom_
 ‖⇛ 💮 _${usedPrefix}romanticdouble | romantico2_
 ‖⇛ 💮 _${usedPrefix}romanticmessages | romanticms_
 ‖⇛ 💮 _${usedPrefix}logosky_
 ‖⇛ 💮 _${usedPrefix}taza | logotaza_
 ‖⇛ 💮 _${usedPrefix}taza2 | logotaza2_
 ‖⇛ 💮 _${usedPrefix}technology | tecnologia_
 ‖⇛ 💮 _${usedPrefix}coff_
 ‖⇛ 💮 _${usedPrefix}lolice_
 ‖⇛ 💮 _${usedPrefix}simpcard_
 ‖⇛ 💮 _${usedPrefix}hornycard_ 
 ‖⇛ 💮 _${usedPrefix}lblackpink_
 ‖⇛ 💮 _${usedPrefix}logocorazon_
 ‖⇛ 💮 _${usedPrefix}tahta *texto*_
 ‖⇛ 💮 _${usedPrefix}nulis | notas *texto*_
 ‖⇛ 💮 _${usedPrefix}nulis2 | notas2 *texto*_
 ‖⇛ 💮 _${usedPrefix}lolice *@tag*_
 ‖⇛ 💮 _${usedPrefix}simpcard *@tag*_
 ‖ ➥ ⧼ *_MENÚ LOGOS PERSONALIZADO_* ⧽ 
╰━〘 🐈🌟🐈🌟🐈🌟🐈🌟🐈 〙━╯
𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨`.trim()
conn.send3ButtonLoc(m.chat, (await fetch(pp)).buffer(), `
⁖ᯓ፨҈༺ 𝙂𝙖𝙩𝙖𝘽𝙤𝙩 | 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 ༻፨҈ᯓ⁖
`.trim(), menu, '📦 𝙈𝙀𝙉𝙐 𝘾𝘼𝙅𝘼 𝘼𝙇𝙈𝘼𝘾𝙀𝙉 📦', `#menucaja`, '👤 𝙈𝙀𝙉𝙐 𝘾𝙃𝘼𝙏 𝘼𝙉𝙊𝙉𝙄𝙈𝙊 👤', `#menuchat`, '💎 𝙈𝙀𝙉𝙐 𝙋𝙍𝙊𝙋𝙄𝙀𝙏𝘼𝙍𝙄𝙊/𝘼 💎', `#menupropietaria`, m, false, { contextInfo: { mentionedJid }})}

handler.command = /^(menulogos|menulogos|menucrearlogos|mlogos|Menucrearlogos|Mlogos|menúcrearlogos|menucrearlogo|mlogo)$/i
module.exports = handler
