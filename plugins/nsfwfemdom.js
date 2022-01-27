let handler = async (m, { conn }) => {
  //await m.reply(wait)
  let res = `https://server-api-rey.herokuapp.com/api/nsfw/femdom?apikey=apirey`
  conn.sendFile(m.chat, res, 'femdom.jpg', `*Disfrutalo!!*`, m)
}
handler.help = ['femdom']
handler.tags = ['nsfw']
handler.command = /^(femdom)$/i
handler.limit = false 

module.exports = handler
