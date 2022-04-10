const axios = require('axios')
 let handler = async(m, { conn }) => {
  let chat = global.DATABASE._data.chats[m.chat]
  if (!(data.chats[m.chat].nsfw && m.isGroup)) throw 'Escriba *!enable* *nsfw* para activar esta característica'
let les = await axios.get('https://meme-api.herokuapp.com/gimme/yuri')
            conn.sendFile(m.chat, `${les.data.url}`, '', `${les.data.title}`, m)
  }
handler.help = ['yuri']
handler.tags = ['nsfw']
handler.command = /^(yuri)$/i 
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
