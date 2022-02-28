let axios = require('axios');
let fetch = require('node-fetch')
let neko = require('nekos.life')
let Neko = new neko()
     let handler  = async (m, { conn, args }) => {
     json = (await axios.get('https://meme-api.herokuapp.com/gimme/ecchi')).data
   conn.sendFile(m.chat, json.url, 'ecchi.jpg', json.title, m, false)
}
handler.help = ['ecchi']
handler.tags = ['sange']
handler.command = /^ecchi$/i 
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.limit = false
handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
