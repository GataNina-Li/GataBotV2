let fetch = require('node-fetch')
     let handler  = async (m, { conn, usedPrefix, command }) => {
    heum = await fetch(`https://api.xteam.xyz/randomimage/nsfwneko?APIKEY=29d4b59a4aa687ca`)
    json = await heum.buffer()
   conn.sendButtonImg(m.chat, json, '*¡Disfrutalo!*', 'Gata Dios', 'SIGUIENTE 🔄', `${usedPrefix + command}`, m, false)
}
handler.command = /^(nsfwloli)$/i 

module.exports = handler
