const axios = require('axios')
 let handler = async(m, { conn }) => {
 if (!DATABASE._data.chats[m.chat].nsfw && m.isGroup) throw '❰ ⚠️ ❱ *Función Nsfw Desactivada*\n*Escriba #on nsfw para activar esta Función.*'
let les = await axios.get('https://meme-api.herokuapp.com/gimme/booty')
            conn.sendFile(m.chat, `${les.data.url}`, '', `${les.data.title}`, m)
  }
handler.command = /^(booty|culo|culos|culo2|culos2)$/i 
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.register = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 200
handler.limit = false

module.exports = handler
