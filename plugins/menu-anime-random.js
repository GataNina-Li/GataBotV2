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
 ‖⇛ 🪅 _${usedPrefix}randomwallpaper_
 ‖⇛ 🪅 _${usedPrefix}compartirfoto_
 ‖⇛ 🪅 _${usedPrefix}futbol_
 ‖⇛ 🪅 _${usedPrefix}Messi_
 ‖⇛ 🪅 _${usedPrefix}animal_
 ‖⇛ 🪅 _${usedPrefix}meme_
 ‖⇛ 🪅 _${usedPrefix}meme2_
 ‖⇛ 🪅 _${usedPrefix}meme3_
 ‖⇛ 🪅 _${usedPrefix}cat | gato | gata_
 ‖⇛ 🪅 _${usedPrefix}dog | perro | perra_
 ‖⇛ 🪅 _${usedPrefix}pikachu_
 ‖⇛ 🪅 _${usedPrefix}waifu_
 ‖⇛ 🪅 _${usedPrefix}blackpink_
 ‖⇛ 🪅 _${usedPrefix}reto_
 ‖⇛ 🪅 _${usedPrefix}verdad_
 ‖⇛ 🪅 _${usedPrefix}imagenrandom | random | epico_
 ‖⇛ 🪅 _${usedPrefix}neko_
 ‖⇛ 🪅 _${usedPrefix}lolivid_
 ‖⇛ 🪅 _${usedPrefix}iqtest | iq | inteligencia_
 ‖⇛ 🪅 _${usedPrefix}kpopitzy_
 ‖⇛ 🪅 _${usedPrefix}navidad_
 ‖⇛ 🪅 _${usedPrefix}loli_
 ‖⇛ 🪅 _${usedPrefix}gawrgura_
 ‖⇛ 🪅 _${usedPrefix}miku_
 ‖⇛ 🪅 _${usedPrefix}nyan_
 ‖⇛ 🪅 _${usedPrefix}pat_
 ‖⇛ 🪅 _${usedPrefix}itachi_
 ‖⇛ 🪅 _${usedPrefix}slap_
 ‖⇛ 🪅 _${usedPrefix}pat_
 ‖⇛ 🪅 _${usedPrefix}perfil_
 ‖⇛ 🪅 _${usedPrefix}scan | datos | escaneo_
 ‖⇛ 🪅 _${usedPrefix}kpop_
 ‖⇛ 🪅 _${usedPrefix}qr *texto*_
 ‖⇛ 🪅 _${usedPrefix}afk | aviso | informo *motivo*_
 ‖⇛ 🪅 _${usedPrefix}CristianoRonaldo_
 ‖⇛ 🪅 _${usedPrefix}pregunta *pregunta*_
 ‖⇛ 🪅 _${usedPrefix}mention | mensaje *texto*_
 ‖⇛ 🪅 _${usedPrefix}spamchat *texto*_
 ‖⇛ 🪅 _${usedPrefix}traducir es *texto*_
 ‖⇛ 🪅 _${usedPrefix}zodiac | zodiaco *AAAA MM DD*_
 ‖⇛ 🪅 _${usedPrefix}readmore | leermas *texto1| texto2*_
 ‖⇛ 🪅 _${usedPrefix}calc | calculadora *expresión mat.*_ 
 ‖⇛ 🪅 _${usedPrefix}spamwa *numero|texto|cantidad*_
 ‖⇛ 🪅 _${usedPrefix}readqr *responde a un código QR*_
 ‖⇛ 🪅 _${usedPrefix}anime *random / waifu / husbu /neko*_
 ‖⇛ 🪅 _${usedPrefix}agendar *@tag + nombre contacto*_
 ‖⇛ 🪅 _${usedPrefix}guardar *@tag + nombre contacto*_
 ‖⇛ 🪅 _${usedPrefix}spam *numero|texto|cantidad*_ 
 ‖⇛ 🪅 _${usedPrefix}spoiler | hidetext *texto1| texto2*_
 ‖⇛ 🪅 _${usedPrefix}experiencia | exp_
 ‖ ➥ ⧼ *_MENÚ ANIME/RANDOM_* ⧽  
╰━〘 🐈🌟🐈🌟🐈🌟🐈🌟🐈 〙━╯
`.trim()
let mentionedJid = [who]
conn.send3ButtonImg(m.chat, pp, menu, '𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨', '🔞 MENÚ +18 🔞', `#labiblia`, '🔊 MENÚ DE AUDIOS 🔊', `#menuaudio`, '📦 MENÚ CAJA ALMACENAMIENTO 📦', `#menucaja`, m, false, { contextInfo: { mentionedJid }})   
}

handler.command = /^(menurandom|menuextras|Menurandom|Menuextras|menúrandom|menúextra|menúextras)$/i
handler.fail = null
module.exports = handler
