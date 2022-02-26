let fetch = require('node-fetch')
let handler = async (m, { text, usedPrefix, command, args }) => {
let msg = `*[❗] Uso correcto del comando ${usedPrefix + command} (Autor) (Cancion)*\n*Ejemplo:*\n*${usedPrefix + command} Beret Ojala*`
if (!args || !args[0]) return m.reply(msg)
try {
let res = await fetch(global.API('https://some-random-api.ml', '/lyrics', {
title: text}))
if (!res.ok) throw await res.text()
let json = await res.json()
if (!json.thumbnail.genius) throw json
let teks = `*${json.title}*\n_${json.author}_\n\n${json.lyrics}\n\n\n${json.links.genius}`
let foot = '©𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨'
conn.send2ButtonImg(m.chat, await(await fetch(json.thumbnail.genius)).buffer(), teks, foot,'🎧 DESCARGAR MUSICA 🔊', `#play ${text}`, '🎥 DESCARGAR VIDEO 🎞️', `#play2 ${text}`, m)
} catch (e) {
console.log(e)
m.reply('*[❗] No se encontro la letra de la canción, por favor prueba con otra*')}}
handler.command = /^(l(irik|yrics)|letra)$/i
module.exports = handler
