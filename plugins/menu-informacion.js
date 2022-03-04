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
 ‖⇛ 🔖 _${usedPrefix}donar_
 ‖⇛ 🔖 _${usedPrefix}infobot_
 ‖⇛ 🔖 _${usedPrefix}creditos_ 
 ‖⇛ 🔖 _${usedPrefix}reglas_
 ‖⇛ 🔖 _${usedPrefix}grupos_
 ‖⇛ 🔖 _${usedPrefix}estado_
 ‖⇛ 🔖 _${usedPrefix}menusimple_
 ‖⇛ 🔖 _${usedPrefix}menuaudios_
 ‖⇛ 🔖 _${usedPrefix}instalarbot_
 ‖⇛ 🔖 _${usedPrefix}procesobot_
 ‖⇛ 🔖 _${usedPrefix}bug *tal comando con fallas*_
 ‖⇛ 🔖 _${usedPrefix}reporte *tal comando con fallas*_
 ‖⇛ 🔖 _${usedPrefix}report *tal comando con fallas*_
 ‖⇛ 🔖 _${usedPrefix}owner_
 ‖⇛ 🔖 _${usedPrefix}contacto_
 ‖⇛ 🔖 _${usedPrefix}join *enlace del grupo*_
 ‖⇛ 🔖 _${usedPrefix}unete *enlace del grupo*_ 
 ‖⇛ 🔖 _${usedPrefix}bots *ver bots*_
 ‖⇛ 🔖 _¿Qué es un Bot?_
 ‖⇛ 🔖 _Codigos para audios_
 ‖⇛ 🔖 _Términos y condiciones_
╰━〘 🐈🌟🐈⚡️🐈🌟🐈⚡️🐈 〙━╯
`.trim()
let mentionedJid = [who]
conn.send3ButtonImg(m.chat, pp, menu, '𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨', 'Hola 😸', `Hola`, 'Menú de Audios 🔊', `#menuaudios`, 'Menú simple ⚡️', `#menusimple`, m, false, { contextInfo: { mentionedJid }})   
}

handler.command = /^(m2)$/i
handler.fail = null
module.exports = handler
