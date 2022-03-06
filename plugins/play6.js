let fetch = require('node-fetch')
let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!text) throw `*Formato de uso: ${usedPrefix + command} Nombre de la canción o video*\n*Ejemplo:*\n*${usedPrefix + command} Beret ojala*`
let res = await fetch("https://api-alc.herokuapp.com/api/download/play-mp4?query="+text+"&apikey=ConfuMods")
let json = await res.json()
conn.sendFile(m.chat, json.link, 'error.mp4', `   *Aqui tienes el video :D*\nGata Dios`, m)}
handler.command = /^(play6)$/i
module.exports = handler
