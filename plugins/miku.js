const axios = require('axios')
 let handler = async(m, { conn }) => {
let les = await axios.get('https://meme-api.herokuapp.com/gimme/miku')
            conn.sendFile(m.chat, `${les.data.url}`, '', `*Hatsune Miku*`, m)
  }
handler.help = ['miku']
handler.tags = ['random']
handler.command = /^(miku)$/i
handler.limit = false

module.exports = handler
