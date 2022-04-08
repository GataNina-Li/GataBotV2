let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/hentai.mp3'
conn.sendFile(m.chat, vn, 'hentai.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Hentai|HENTAI|hentai|/i 
handler.command = new RegExp
module.exports = handler

