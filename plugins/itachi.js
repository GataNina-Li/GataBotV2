let handler = async (m, { conn }) => {
  //await m.reply(wait)
  let res = `https://api-reysekha.herokuapp.com/api/wallpaper/itachi?apikey=APIKEY`
  conn.sendFile(m.chat, res, 'itachi.jpg', `© sekha`, m)
}
handler.help = ['Itachi']
handler.tags = ['General']
handler.command = /^(itachi)$/i
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
