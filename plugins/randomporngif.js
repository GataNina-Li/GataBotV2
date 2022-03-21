let fetch = require("node-fetch")
const { sticker } = require('../lib/sticker')
const { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn}) => {
try {
let res = await fetch('https://meme-api.herokuapp.com/gimme/porngif')
let json = await res.json()
let { url } = json
let stiker = await sticker(null, url, 'Pornogif', 'GataBot 🐈 - Gata Dios')
conn.sendMessage(m.chat, stiker, MessageType.sticker, { quoted: m })
} catch (e) { }}

handler.help = ['pornogif']
handler.tags = ['General']
handler.command = /^(pornogif)$/i 
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
