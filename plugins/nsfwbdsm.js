let handler = async (m, { conn }) => {
  //await m.reply(wait)
  let res = `https://server-api-rey.herokuapp.com/api/nsfw/bdsm?apikey=apirey`
  conn.sendFile(m.chat, res, 'bdsm.jpg', `*Disfrutalo!!*`, m)
}
handler.help = ['bdsm']
handler.tags = ['nsfw']
handler.command = /^(bdsm)$/i
handler.limit = false

module.exports = handler
