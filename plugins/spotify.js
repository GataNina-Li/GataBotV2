let fetch = require('node-fetch')
let handler = async(m, { conn, text }) => {
if (!text) throw '*Ingrese el nombre de alguna cancion a buscar!!*'
let res = await fetch(global.API('zeks', '/api/spotify', { q: text }, 'apikey'))
if (!res.ok) throw await res.text()
let json = await res.json()
if(!json.data[0]) throw json
let { title, artists, album, thumb, url, preview_mp3 } = json.data[0]
let spotifyi = `❒══════❬ SPOTIFY ❭══════╾❒
┇
┇➠ 🌸 *Titulo:* ${title}
┇
┇➠ 🗣 *Artista:* ${artists}
┇
┇➠ 🎆 *Album:* ${album}
┇
┇➠ ⚡️ *URL*: ${url}
┇
┇➠ 💥 *Dirección de URL:* ${preview_mp3}\n┇\n┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍❒\n\n*_⏳ Enviando música de previsualización_*\n\n🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈`

await conn.sendFile(m.chat, thumb, '', spotifyi, m)
await conn.sendFile(m.chat, preview_mp3, 'spotify.mp3', spotifyi, m)
}
handler.command = /^(spotify|spotimusica)$/i


module.exports = handler 
