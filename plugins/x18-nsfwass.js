let fetch = require('node-fetch')
     let handler  = async (m, { conn, usedPrefix, command }) => {
     if (!DATABASE._data.chats[m.chat].nsfw && m.isGroup) throw '❰ ⚠️ ❱ *Función Nsfw Desactivada*\n*Escriba #on nsfw para activar esta Función.*'    
    heum = await fetch(`https://server-api-rey.herokuapp.com/api/nsfw/ass?apikey=apirey`)
    json = await heum.buffer()
   conn.sendButtonImg(m.chat, json, '*¡Disfrutalo!*', 'Gata Dios', 'SIGUIENTE 🔄', `${usedPrefix + command}`, m, false)
}
handler.command = /^(nsfwass)$/i 

module.exports = handler
