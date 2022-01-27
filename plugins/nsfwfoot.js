let handler = async (m, { conn }) => {
  //await m.reply(wait)
  let res = `https://server-api-rey.herokuapp.com/api/nsfw/foot?apikey=apirey`
  conn.sendFile(m.chat, res, 'foot.jpg', `*Disfrutalo!!*`, m)
}
handler.help = ['foot']
handler.tags = ['nsfw']
handler.command = /^(foot)$/i
handler.limit = false

module.exports = handler
