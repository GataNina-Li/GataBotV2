const axios = require('axios')
 let handler = async(m, { conn }) => {
let les = await axios.get('https://meme-api.herokuapp.com/gimme/Itachi')
            conn.sendFile(m.chat, `${les.data.url}`, '', `${les.data.title}`, m)
  }
handler.help = ['Itachi']
handler.tags = ['General']
handler.command = /^(itachi)$/i
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