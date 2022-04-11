let axios = require("axios")
let handler = async (m, { conn }) => {
if (!DATABASE._data.chats[m.chat].nsfw && m.isGroup) throw '❰ ⚠️ ❱ *Función Nsfw Desactivada*\n*Escriba #on nsfw para activar esta Función.*'   

   await m.reply('*_😋 un momento..._*')
    let res = await axios("https://api.waifu.pics/nsfw/trap")
    let json = res.data
    let url = json.url
    conn.sendFile(m.chat, url, "error.png", "*¡UN TRAPITO! 🤤*", m)

    }

handler.help = ['htrap']
handler.tags = ['internet']
handler.command = /^htrap|trapito$/i
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
