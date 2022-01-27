let handler = async (m, { conn }) => {
  //await m.reply(wait)
  let res = `https://api-reysekha.herokuapp.com/api/wallpaper/sasuke?apikey=APIKEY`
  conn.sendFile(m.chat, res, 'Error.jpg', `*©The Shadow brokers - Bot*`, m)
}
handler.help = ['sasuke']
handler.tags = ['random']
handler.command = /^(sasuke)$/i
handler.limit = false

module.exports = handler
