let handler = async (m, { conn }) => {
  //await m.reply(wait)
  let res = `https://server-api-rey.herokuapp.com/api/nsfw/cum?apikey=apirey`
  conn.sendFile(m.chat, res, 'Error.jpg', `*Disfrutalo!!*`, m)
}
handler.help = ['cum']
handler.tags = ['nsfw']
handler.command = /^(cum)$/i
handler.limit = false

module.exports = handler
