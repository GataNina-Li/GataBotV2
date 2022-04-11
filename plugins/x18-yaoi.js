let fetch = require("node-fetch")
const { sticker } = require('../lib/sticker')
const { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn}) => {
if (!DATABASE._data.chats[m.chat].nsfw && m.isGroup) throw '❰ ⚠️ ❱ *Función Nsfw Desactivada*\n*Escriba #on nsfw para activar esta Función.*'  
try {
let res = await fetch('https://meme-api.herokuapp.com/gimme/yaoigif')
let json = await res.json()
let { url } = json
let stiker = await sticker(null, url, 'Yaoigif', 'GataBot 🐈 - Gata Dios')
conn.sendMessage(m.chat, stiker, MessageType.sticker, { quoted: m })
} catch (e) { }}

handler.help = ['yaoigif']
handler.tags = ['General']
handler.command = /^(yaoigif)$/i 
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
