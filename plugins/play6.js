let fetch = require('node-fetch')
let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!text) throw `*Formato de uso: ${usedPrefix + command} Nombre de la canción o video*\n*Ejemplo:*\n*${usedPrefix + command} Billie Eilish bored*`
let res = await fetch("https://api-reysekha.herokuapp.com/api/download/ytmp4?url="+text+"&apikey=APIKEY")
let json = await res.json()
conn.sendFile(m.chat, json.link, 'error.mp4', `*¡Aqui tienes el video!*\n🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈`, m)}
handler.command = /^(play6)$/i
module.exports = handler
//https://api-reysekha.herokuapp.com/api/download/ytmp4?url=https://youtu.be/6l5V3BWDcMw&apikey=APIKEY
//https://api-alc.herokuapp.com/api/download/play-mp4?query="+text+"&apikey=ConfuMods
