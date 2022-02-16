let fetch = require('node-fetch')
     let handler  = async (m, { conn, usedPrefix, command }) => {
    heum = await fetch(`https://api.lolhuman.xyz/api/pinterestdl?apikey`)
    json = await heum.buffer()
   conn.sendButtonImg(m.chat, json, '*¡Disfrutalo!*', 'Gata Dios', 'SIGUIENTE 🔄', `${usedPrefix + command}`, m, false)
}
handler.command = /^(bdsm|nsfwbdsm)$/i

module.exports = handler
