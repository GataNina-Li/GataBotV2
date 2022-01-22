const axios = require('axios')
 let handler = async(m, { conn }) => {
let les = await axios.get('https://meme-api.herokuapp.com/gimme/meme')
            conn.sendFile(m.chat, `${les.data.url}`, '', `${les.data.title}`, m)
  }
handler.help = ['meme2']
handler.tags = ['images']
handler.command = /^(meme2)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = false

module.exports = handler
