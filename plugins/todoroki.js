let fetch = require('node-fetch')
     let handler  = async (m, { conn, usedPrefix, command }) => {
    heum = await fetch(`https://api-alc.herokuapp.com/api/anime/todoroki-shoto?apikey=ConfuMods`)
    json = await heum.buffer()
   conn.sendButtonImg(m.chat, json, '*Incluso el más fuerte de los oponentes tiene siempre una debilidad*', 'Gata Dios', 'SIGUIENTE', `${usedPrefix + command}`, m, false)
}
handler.command = /^(todoroki)$/i
module.exports = handler
