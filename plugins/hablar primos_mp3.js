let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/hablar primos.mp3'
conn.sendFile(m.chat, vn, 'hablar primos.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /hablar primos|Hablar primos/ 
handler.command = new RegExp
module.exports = handler
