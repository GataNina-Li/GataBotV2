const axios = require('axios')
 let handler = async(m, { conn }) => {
if (!DATABASE._data.chats[m.chat].nsfw && m.isGroup) throw 'Feature Nsfw Disable\nType *!enable* *nsfw* to activate this feature'
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
handler.exp = 200
handler.limit = false

module.exports = handler
