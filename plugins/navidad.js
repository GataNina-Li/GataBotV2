const axios = require('axios')
let handler = async(m, { conn }) => {
let porn = await axios.get('https://meme-api.herokuapp.com/gimme/Christmas')
           conn.sendFile(m.chat, `${porn.data.url}`, '', `${porn.data.title}
🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈 `, m)
  }
handler.help = ['Navidad']
handler.tags = ['images']
handler.command = /^(navidad)$/i
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
