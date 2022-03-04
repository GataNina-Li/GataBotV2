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
 ‖⇛ 💎 _${usedPrefix}boost | acelerar_
 ‖⇛ 💎 _${usedPrefix}restart_
 ‖⇛ 💎 _${usedPrefix}banlist_
 ‖⇛ 💎 _${usedPrefix}virtext1 | traba1_
 ‖⇛ 💎 _${usedPrefix}actualizar | update_
 ‖⇛ 💎 _${usedPrefix}bc *texto*_
 ‖⇛ 💎 _${usedPrefix}bcgc *texto*_
 ‖⇛ 💎 _${usedPrefix}bcbot *texto*_
 ‖⇛ 💎 _${usedPrefix}setbye *@tag*_
 ‖⇛ 💎 _${usedPrefix}banuser *@tag*_
 ‖⇛ 💎 _${usedPrefix}enable *public*_
 ‖⇛ 💎 _${usedPrefix}disable *public*_
 ‖⇛ 💎 _${usedPrefix}unbanuser *@tag*_
 ‖⇛ 💎 _${usedPrefix}listgroup_
 ‖⇛ 💎 _${usedPrefix}enable *restrict*_
 ‖⇛ 💎 _${usedPrefix}enable *autoread*_
 ‖⇛ 💎 _${usedPrefix}setwelcome *@tag*_
 ‖⇛ 💎 _${usedPrefix}enable *autoread*_
 ‖⇛ 💎 _${usedPrefix}disable *autoread*_
 ‖⇛ 💎 _${usedPrefix}bcbot *texto*_
 ‖⇛ 💎 _${usedPrefix}bcgc *texto*
 ‖ ➥ ⧼ *_MENÚ PROPIETARIO/A DEL BOT_* ⧽ 
╰━〘 🐈🌟🐈🌟🐈🌟🐈🌟🐈 〙━╯
`.trim()
let mentionedJid = [who]
conn.send3ButtonImg(m.chat, pp, menu, '𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨', 'Hola 😸', `Hola`, 'Menú de Audios 🔊', `#menuaudios`, 'Menú simple ⚡️', `#menusimple`, m, false, { contextInfo: { mentionedJid }})   
}

handler.command = /^(m10)$/i
handler.fail = null
module.exports = handler
