//
const fetch = require('node-fetch')
const FormData = require('form-data')
const { MessageType } = require('@adiwajshing/baileys')
const { sticker } = require('../lib/sticker')
const gs = require('nekos.life')
const neko = new gs()

let handler  = async (m, { conn, text }) => {
  pp = (await neko.sfw.nekoGif()).url
                     await sticker(false, pp, 'SFW Neko', author).then(gege => {
                     conn.sendMessage(m.chat, gege, 'stickerMessage', { quoted: m })
                     })
  //if (!text) throw 'Uhm...Teksnya?'
}
handler.help = ['nekogif (sfw)']
handler.tags = ['wibu']
handler.command = /^nekogif$/i 
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
