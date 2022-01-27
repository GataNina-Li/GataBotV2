let handler = async (m, { conn }) => {
  //await m.reply(wait)
  let res = `https://server-api-rey.herokuapp.com/api/wallpaper/nsfwloli?apikey=apirey`
  conn.sendFile(m.chat, res, 'Error.jpg', `*Disfrutalo!!*`, m)
}
handler.help = ['nsfwloli']
handler.tags = ['nsfw']
handler.command = /^(nsfwloli)$/i
handler.limit = false

module.exports = handler
