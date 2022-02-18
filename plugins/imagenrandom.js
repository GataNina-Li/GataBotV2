const axios = require('axios')
 let handler = async(m, { conn }) => {
let les = await axios.get('https://meme-api.herokuapp.com/gimme/sticker')
            conn.sendFile(m.chat, 'Gata Dios' `${les.data.url}`, '', `${les.data.title}`, m)
  }
handler.help = ['imagenrandom']
handler.tags = ['images']
handler.command = /^(imagenrandom)$/i
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
