let fetch = require('node-fetch')
     let handler  = async (m, { conn, usedPrefix, command }) => {
    heum = await fetch(`https://server-api-rey.herokuapp.com/api/nsfw/glasses?apikey=apirey`)
    json = await heum.buffer()
   conn.sendButtonImg(m.chat, json, '*Disfrutalo!!*', '©The Shadow Brokers - Bot', 'SIGUIENTE', `${usedPrefix + command}`, m, false)
}
handler.command = /^(glass|nsfwglass)$/i

module.exports = handler
