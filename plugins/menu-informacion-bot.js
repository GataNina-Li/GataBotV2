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
╭══〘 🐈⚡️🐈⚡️🐈⚡️🐈 〙══╮
║═ 𝙂𝙖𝙩𝙖𝘽𝙤𝙩 | 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
║❇️ *¡𝗛ola! ${username}* ❇️
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
║🔰 *Creadora/Editora: Gata Dios* 
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
╰══〘 🐈⚡️🐈⚡️🐈⚡️🐈 〙══╯
`.trim()
let mentionedJid = [who]

handler.command = /^(m1)$/i
handler.fail = null
module.exports = handler
