const axios = require('axios')
//if (isBanned) return  reply(mess.banned)
//if (!isGroup) return reply('esta función es solo para grupos')
let handler = async(m, { conn }) => {
if (!DATABASE._data.chats[m.chat].nsfw && m.isGroup) throw '❰ ⚠️ ❱ *Función Nsfw Desactivada*\n*Escriba #on nsfw para activar esta Función.*'
let les = await axios.get('https://meme-api.herokuapp.com/gimme/nsfw')
            conn.sendFile(m.chat, `${les.data.url}`, '', `${les.data.title}`, m)
  }
handler.help = ['randomnsfw']
handler.tags = ['images']
handler.command = /^(contenido18|18contenido)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.register = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = false

module.exports = handler
