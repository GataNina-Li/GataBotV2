let handler = async (m, { conn }) => {
  await m.reply(wait)
  let res = `https://api-reysekha.herokuapp.com/api/wallpaper/boruto?apikey=APIKEY`
  conn.sendFile(m.chat, res, 'Error.jpg', `*©The Shadow Brokers - Bot*`, m)
}
handler.help = ['naruto']
handler.tags = ['General']
handler.command = /^(naruto)$/i
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
