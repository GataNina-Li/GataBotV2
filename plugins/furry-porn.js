const axios = require('axios')
 let handler = async(m, { conn }) => {
let les = await axios.get('https://meme-api.herokuapp.com/gimme/Furryporn')
            conn.sendFile(m.chat, `${les.data.url}`, '', `*¿Si me pongo de perrito, me adoptas? 🔥🥴*`, m)
  }
handler.command = /^(furry|furro|furr@|furra|furrys|furros|furr@s|furras|furri|furris)$/i 
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
