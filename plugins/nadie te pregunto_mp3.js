let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/nadie te pregunto.mp3'
conn.sendFile(m.chat, vn, 'nadie te pregunto.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /nadie te pregunto|Nadie te pregunto|Nadie te preguntó|nadie te preguntó/ 
handler.command = new RegExp
module.exports = handler
