let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/orale.mp3'
conn.sendFile(m.chat, vn, 'orale.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /orale|Orale/ 
handler.command = new RegExp
module.exports = handler
