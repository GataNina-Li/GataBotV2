let axios = require("axios")



let handler = async (m, { conn }) => {

   await m.reply('*_😋 un momento..._*')

    let res = await axios("https://api.waifu.pics/nsfw/trap")

    let json = res.data

    let url = json.url

    conn.sendFile(m.chat, url, "error.png", "*¡UN TRAPITO! 🤤*", m)

    }

handler.help = ['htrap']

handler.tags = ['internet']

handler.command = /^htrap|trapito$/i

handler.premium = false

handler.register = false

//Tenkyuu to Unx-sama

module.exports = handler
