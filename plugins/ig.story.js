let axios = require("axios");
let handler = async(m, { conn, text }) => {

    if (!text) return conn.reply(m.chat, 'Uhm... urlnya mana?', m)

    conn.reply(m.chat, 'Searching...', m)
        axios.get(`https://st4rz.herokuapp.com/api/ig?url=` + text)
            .then((res) => {
              let dl_link = res.data.result.videos
                    // conn.reply(m.chat, `*Link:* ${dl_link} `, m)
                conn.sendFile(m.chat, dl_link, '.mp4', `*Title:* ${text}\n*Link:* ${dl_link}`, m)
    })
}
handler.help = ['ig']
handler.tags = ['downloader']
handler.command = /^ig$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = true

module.exports = handler
