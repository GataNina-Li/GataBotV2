let fetch = require('node-fetch')
let handler = async(m, { conn, text }) => {
if (!text) throw `*Ingrese el nombre de alguna cancion a buscar!!*`
let res = await fetch(global.API('zeks', '/api/spotify', { q: text }, 'apikey'))
if (!res.ok) throw await res.text()
let json = await res.json()
if(!json.data[0]) throw json
let { title, artists, album, thumb, url, preview_mp3 } = json.data[0]
let spotifyi = `❒═════❬ SPOTIFY ❭═════╾❒
┬
├‣✨ *Titulo:* ${title}
┴
┬
├‣🗣️ *Artista:* ${artists}
┴
┬
├‣🎆 *Album:* ${album}
┴
┬
├‣🌐 *URL*: ${url}
┴
┬
├‣💚 *Direct URL:* ${preview_mp3}\n┴\n\n*_- Enviando música de previsualización_*\n\n_﹫ᴛʜᴇ Sʜᴀᴅᴏᴡ ʙʀᴏᴋᴇʀs ﹣ ʙᴏᴛ_`

await conn.sendFile(m.chat, thumb, '', spotifyi, m)
await conn.sendFile(m.chat, preview_mp3, 'spotify.mp3', spotifyi, m)
}
handler.command = /^(spotify|music)$/i


module.exports = handler