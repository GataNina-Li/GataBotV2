let handler = async (m, { conn }) => {
  //await m.reply(wait)
  let res = `https://server-api-rey.herokuapp.com/api/nsfw/ero?apikey=apirey`
  conn.sendFile(m.chat, res, 'ero.jpg', `*Disfrutalo!!*`, m)
}
handler.help = ['ero']
handler.tags = ['nsfw']
handler.command = /^(ero)$/i
handler.limit = false

module.exports = handler
