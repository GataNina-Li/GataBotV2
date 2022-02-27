let fetch = require("node-fetch")
const { sticker } = require('../lib/sticker')
const { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn}) => {
  try {
  let res = await fetch('https://neko-love.xyz/api/v1/neko')
  let json = await res.json()
  let { 
url
} = json
let stiker = await sticker(null, url, 'Nyan', 'GataBot 🐈 - Gata Dios')
  conn.sendMessage(m.chat, stiker, MessageType.sticker, {
    quoted: m
  })
 } catch (e) {
  }
}
handler.help = ['nyan']
handler.tags = ['expression']
handler.command = /^nyan/i

module.exports = handler
