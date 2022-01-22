let { MessageType, Presence, MimeType } = require('@adiwajshing/baileys')
let uploadImage = require('../lib/uploadImage')
let fetch = require('node-fetch')
let ftype = require('file-type')
let axios = require('axios')
let fs = require('fs')

let handler = async(m, { conn, text, args, usedPrefix }) => {

  await m.reply('Aguarde, estoy procesando el codigo qr...')
    let q = m.quoted ? m.quoted : m
    let media = await q.download()
    if (!media && !m.quoted) throw `Responda a una imagen o envie una imagen con el comando ${usedPrefix}readqr\nRecuerde que la imagen debe ser un codigo qr`
    let qr = await uploadImage(media)
          axios.get(`https://api.zeks.xyz/api/qrdecode?apikey=MIMINGANZ&image=${qr}`).then((res) => {

  conn.reply(m.chat, '*_El codigo qr dice:_*\n\n' + res.data.result, m)
   })
}
handler.help = ['readqr']
handler.tags = ['tools']
handler.command = /^(readqr)$/i
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
