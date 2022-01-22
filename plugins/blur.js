let uploadImage = require('../lib/uploadImage')
let fetch = require('node-fetch')
let util = require('util')

let handler = async(m, { conn, args }) => {
try {
gay = `sayang`

  if (!m.quoted) throw `Tag Fotonya ` + gay // org gay

    await m.reply(`*[❗] Aguarde un momento, estoy realizando su diseño...*`)
  let q = m.quoted ? m.quoted : m
  let media = await q.download()
  let img = await uploadImage(media)
  let buffer = await (await fetch('https://leyscoders-api.herokuapp.com/api/img/blur?url=' + img + '&level=5&apikey=MIMINGANZ')).buffer() // Masukan ApiKeymu disini..
  let res = await fetch('https://raw.githubusercontent.com/herokuapp-com/kuhong-api/main/info/credit.json')
  let json = await res.json()

 await conn.sendFile(m.chat, buffer, 'error.jpg', '*Listo!!*', m)

} catch (e) {

 err = await (await fetch('https://raw.githubusercontent.com/herokuapp-com/kuhong-api/main/info/erorr.json')).json() // jika Erorr
   throw err
  }
}
handler.help = ['blur (reply)']
handler.tags = ['editor']
handler.command = /^blur$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.register = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = false

module.exports = handler