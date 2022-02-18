let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*[❗️] Que desea buscar?*\n*Inserte un texto*\n${usedPrefix + command} imagen`
  let res = await fetch(global.API('zeks', '/api/pinimg', {
    q: text
  }, 'apikey'))
  if (!res.ok) throw eror
  let json = await res.json()
  if (!json.status) throw json
  let pint = json.data[Math.floor(Math.random() * json.data.length)];
  conn.sendFile(m.chat, pint, '', '© stikerin', m, 0, { thumbnail: await (await fetch(pint)).buffer() })
}
module.exports = handler
handler.help = ['pinterest2 <query>']
handler.tags = ['image']
handler.command = /^pinterest2$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.limit = false
handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
