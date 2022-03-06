let fetch = require('node-fetch')
     let handler  = async (m, { conn, usedPrefix, command }) => {
    heum = await fetch(`https://api-reysekha.herokuapp.com/api/wallpaper/pubg?apikey=APIKEY`)
    json = await heum.buffer()
   conn.sendButtonImg(m.chat, json, '*Incluso el más fuerte de los oponentes tiene siempre una debilidad*', 'Gata Dios', 'SIGUIENTE', `${usedPrefix + command}`, m, false)
}
handler.command = /^(todoroki)$/i
module.exports = handler
