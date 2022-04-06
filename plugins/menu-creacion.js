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
 ‖⇛ 🎨 _${usedPrefix}s_
 ‖⇛ 🎨 _${usedPrefix}sticker_
 ‖⇛ 🎨 _${usedPrefix}semoji | emoji_
 ‖⇛ 🎨 _${usedPrefix}emojimix 🐱+😼_
 ‖⇛ 🎨 _${usedPrefix}wasted_
 ‖⇛ 🎨 _${usedPrefix}stonks_
 ‖⇛ 🎨 _${usedPrefix}trash *Responda a una foto*_
 ‖⇛ 🎨 _${usedPrefix}sgay *Responda a una foto*_
 ‖⇛ 🎨 _${usedPrefix}circle *Responda a una foto*_
 ‖⇛ 🎨 _${usedPrefix}stickermaker_
 ‖⇛ 🎨 _${usedPrefix}attp *texto*_
 ‖⇛ 🎨 _${usedPrefix}attp2 | s1 | sa *texto*_
 ‖⇛ 🎨 _${usedPrefix}stickerfilter | cs2_
 ‖⇛ 🎨 _${usedPrefix}tomp3 | mp3 *responde a un video*_
 ‖⇛ 🎨 _${usedPrefix}toimg | img *responde a un sticker*_
 ‖⇛ 🎨 _${usedPrefix}togif | gif *responde a sticker/video*_
 ‖⇛ 🎨 _${usedPrefix}ytcomentario | ytcomentar *texto*_
 ‖⇛ 🎨 _${usedPrefix}blur *responde a una imagen*_
 ‖⇛ 🎨 _${usedPrefix}jaal *Responda a una foto*_
 ‖⇛ 🎨 _${usedPrefix}swm *imagen | video | gif*_
 ‖⇛ 🎨 _${usedPrefix}tovideo *responde a una nota de voz*_
 ‖⇛ 🎨 _${usedPrefix}wanted *Responda a una foto*_
 ‖⇛ 🎨 _${usedPrefix}style *texto*_
 ‖⇛ 🎨 _${usedPrefix}estilo *texto*_
 ‖⇛ 🎨 _${usedPrefix}subirestado *texto / video|imagen*_
 ‖⇛ 🎨 _${usedPrefix}subirestado *texto / gif*_
 ‖⇛ 🎨 _${usedPrefix}bass_
 ‖⇛ 🎨 _${usedPrefix}deep_
 ‖⇛ 🎨 _${usedPrefix}earrape_
 ‖⇛ 🎨 _${usedPrefix}fast_
 ‖⇛ 🎨 _${usedPrefix}fat_
 ‖⇛ 🎨 _${usedPrefix}nightcore_
 ‖⇛ 🎨 _${usedPrefix}reverse_
 ‖⇛ 🎨 _${usedPrefix}robot_
 ‖⇛ 🎨 _${usedPrefix}slow_
 ‖⇛ 🎨 _${usedPrefix}tupai
 ‖⇛ 🎨 _${usedPrefix}smooth_
 ‖⇛ 🎨 _${usedPrefix}blown_
 ‖⇛ 🎨 _${usedPrefix}vibracion *cantidad*_
 ‖⇛ 🎨 _${usedPrefix}tovn *audio a nota de voz*
 ‖ ➥ ⧼ *_MENÚ DE CREACIÓN_* ⧽ 
╰━〘 🐈🌟🐈🌟🐈🌟🐈🌟🐈 〙━╯
𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨`.trim()
conn.send3ButtonLoc(m.chat, (await fetch(pp)).buffer(), `
⁖ᯓ፨҈༺ 𝙂𝙖𝙩𝙖𝘽𝙤𝙩 | 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 ༻፨҈ᯓ⁖
`.trim(), menu, '💥 𝘼𝙉𝙄𝙈𝙀/𝙍𝘼𝙉𝘿𝙊𝙈 💥', `#menurandom`, '🔞 𝙈𝙀𝙉𝙐 +18 🔞', `#labiblia`, '🔊 𝙈𝙀𝙉𝙐 𝘿𝙀 𝘼𝙐𝘿𝙄𝙊𝙎 🔊', `#menuaudio`, m, false, { contextInfo: { mentionedJid }})}

handler.command = /^(menucreador|menucreacion|Menucreador|Menucreacion|Menúcreador|Menúcreacion|menúcreacion|menúcreador)$/i
module.exports = handler
