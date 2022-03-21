let fetch = require("node-fetch")
const { sticker } = require('../lib/sticker')
const { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn}) => {
try {
let res = await fetch('https://meme-api.herokuapp.com/gimme/porngif')
let json = await res.json()
let { url } = json
let stiker = await sticker(null, url, 'porngif', '𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨')
conn.sendMessage(m.chat, stiker, MessageType.sticker, { quoted: m })
} catch (e) { }}
handler.customPrefix = /(porno2|Porno2)/i
handler.command = new RegExp
module.exports = handler
