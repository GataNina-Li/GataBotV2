let scraper = require('@bochilteam/scraper')

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `uhm.. url nya mana?\n\ncontoh:\n${usedPrefix + command} https://www.facebook.com/alanwalkermusic/videos/277641643524720`
  await m.reply('Loading...')
  let res = await scraper.facebookdl(args[0])
  let data = res.result.filter(v => /true/.test(v.isVideo) && /mp4/.test(v.ext))
  await conn.sendFile(m.chat, data[1].url, '', `HD: ${data[0].url}`, m)
}
handler.help = ['fb'].map(v => v + ' <url>')
handler.tags = ['downloader']

handler.command = /^f((b|acebook)(dl|download)?(er)?)$/i

handler.limit = true

module.exports = handler
