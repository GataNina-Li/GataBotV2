let axios = require("axios");
let handler = async(m, { conn, text }) => {

    if (!text) return conn.reply(m.chat, '*_✳ Ingrese un link_*️', m)

  await m.reply('*_✅ Acortando link, espere un momento..._*')
	axios.get(`https://api.zeks.xyz/api/urlshort?url=${text}&apikey=MIMINGANZ`).then ((res) => {
	 	let hasil = `*_Link anterior:_*\n${text}\n\n*_Link nuevo:_*\n${res.data.result}`

    conn.reply(m.chat, hasil, m)
	})
}
handler.help = ['tinyurl','short2'].map(v => v + ' <link>')
handler.tags = ['tools']
handler.command = /^(tinyurl|short2|acortar|corto)$/i
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