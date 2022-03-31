let fetch = require('node-fetch')
     let handler  = async (m, { conn, usedPrefix, command }) => {
    heum = await fetch(`https://api.xteam.xyz/randomimage/hentai?APIKEY=29d4b59a4aa687ca`)
    json = await heum.buffer()
   conn.sendButtonImg(m.chat, json, '*Hentai 🥵*', 'Gata Dios', 'SIGUIENTE 🔄', `${usedPrefix + command}`, m, false)
}
handler.command = /^(hentai|hentay)$/i

module.exports = handler
