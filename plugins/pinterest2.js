let fetch = require('node-fetch')
     let handler  = async (m, { conn, args, text }) => {
     if (!text) throw '*[❗️] Que desea buscar?*\n*Inserte un texto*'
 if (text) m.reply('*[ ✔️ ] Buscando, aguarde un momento....*\n\n*[❗️] Si llega a dar algun problema intente de nuevo con otro texto*')
    heum = await require('../lib/scraper').pinterest(text)
    json = await heum
    random = json.result[Math.floor(Math.random() * json.result.length)]
    if (json.result.length == 0) return conn.sendFile(m.chat, './Menu2.jpg', 'error not found', 'ERROR 404 NOT FOUND', m)
     let res = await fetch(global.API('zeks', '/api/pinimg', {
    q: text
  }, 'apikey'))
  if (!res.ok) throw eror
  let json = await res.json()
  if (!json.status) throw json
  let pint = json.data[Math.floor(Math.random() * json.data.length)];
  conn.sendFile(m.chat, pint, '', '© stikerin', m, 0, { thumbnail: await (await fetch(pint)).buffer() })
}
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
