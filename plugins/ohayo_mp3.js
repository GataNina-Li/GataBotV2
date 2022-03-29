let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/ohayo.mp3'
conn.sendFile(m.chat, vn, 'ohayo.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Ohayo|ohayo|Ojayo|ojayo|Ohallo|ohallo|Ojallo|ojallo/ 
handler.command = new RegExp
module.exports = handler
