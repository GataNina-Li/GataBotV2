let handler = async (m, { conn }) => {
  //await m.reply(wait)
  let res = `https://api-reysekha.herokuapp.com/api/wallpaper/sakura?apikey=APIKEY`
  conn.sendFile(m.chat, res, 'Error.jpg', `*©The Shadow Brokers - Bot*`, m)
}
handler.help = ['sakura']
handler.tags = ['random']
handler.command = /^(sakura)$/i
handler.limit = false

module.exports = handler
