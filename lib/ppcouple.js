let fetch = require('axios').get 
     let handler  = async (m, { conn, args }) => {
    heum = (await fetch(`https://raw.githubusercontent.com/caliph71/txt/main/couple.json`)).data
    json = heum[Math.floor(Math.random() * heum.length)]
   conn.sendMessage(m.chat, { url: json.male }, 'imageMessage')
   conn.sendMessage(m.chat, { url: json.female }, 'imageMessage')
}
handler.help = ['ppcouple']
handler.tags = ['wibu']
handler.command = /^ppcouple$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
