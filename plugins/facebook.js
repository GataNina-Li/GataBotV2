const { facebook } = require('../lib/facebook')
let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `uhm.. url nya mana?\n\ncontoh:\n${usedPrefix + command} https://www.facebook.com/alanwalkermusic/videos/277641643524720`
  if (!args[0].match(/https:\/\/.*(facebook.com|fb.watch)/gi)) throw `url salah`
  facebook(args[0]).then(async res => {
    let fb = JSON.stringify(res)
    let json = JSON.parse(fb)
    // m.reply(require('util').format(json))
    if (!json.status) throw json
    await m.reply(wait)
    await conn.sendFile(m.chat, json.data[0].url, '', '©LynXzy💌', m)
  }).catch(_ => _)
}
handler.help = ['fb'].map(v => v + ' <url>')
handler.tags = ['downloader']

handler.command = /^f((b|acebook)(dl|download)?(er)?)$/i

module.exports = handler
