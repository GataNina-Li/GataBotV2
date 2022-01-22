// Tolong jangan bully saya bang,, saya cuman mau bisnis :)

let uploadImage = require('../lib/uploadImage')
let fetch = require('node-fetch')
let util = require('util')

let handler = async(m, { conn, args }) => {
try {
gay = `sayang`

  if (!m.quoted) throw `Tag Fotonya ` + gay // org gay

    await m.reply(`*[❗] Aguarde un momento, estoy editando su foto...*`)
  let q = m.quoted ? m.quoted : m
  let media = await q.download()
  let img = await uploadImage(media)
  let buffer = await (await fetch('https://leyscoders-api.herokuapp.com/api/img/hitler?url=' + img + '&apikey=MIMINGANZ')).buffer() // Masukan ApiKeymu disini..
  let res = await fetch('https://raw.githubusercontent.com/herokuapp-com/kuhong-api/main/info/credit.json')
  let json = await res.json()

 await conn.sendFile(m.chat, buffer, 'Nih kak', 'Nih Kak', m)

} catch (e) {

 err = await (await fetch('https://raw.githubusercontent.com/herokuapp-com/kuhong-api/main/info/erorr.json')).json() // jika Erorr
   throw err
  }
}
handler.help = ['hitler (reply)']
handler.tags = ['sticker']
handler.command = /^hit(ler)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = false

module.exports = handler