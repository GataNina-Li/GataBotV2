let fetch = require('node-fetch')
     let handler  = async (m, { conn, usedPrefix, command }) => {
    heum = await fetch(`https://api-reysekha.herokuapp.com/api/wallpaper/mountain?apikey=APIKEY`)
    json = await heum.buffer()
   conn.sendButtonImg(m.chat, json, '🏔⛰🗻', 'Gata Dios', '🔄 SIGUIENTE', `${usedPrefix + command}`, m, false)
}
handler.command = /^(wpmontaña|fondomontaña|Wpmontaña|Fondomontaña|wpmountain|fondomountain)$/i
module.exports = handler
