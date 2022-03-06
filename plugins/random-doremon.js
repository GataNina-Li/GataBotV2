let fetch = require('node-fetch')
     let handler  = async (m, { conn, usedPrefix, command }) => {
    heum = await fetch(`https://api-reysekha.herokuapp.com/api/wallpaper/doraemon?apikey=APIKEY`)
    json = await heum.buffer()
   conn.sendButtonImg(m.chat, json, '🌷 *Más de una vez habrás visto Doraemon* 🌷', '🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈', 'SIGUIENTE 🔄', `${usedPrefix + command}`, m, false)
}
handler.command = /^(doraemon|Doraemon)$/i

module.exports = handler
