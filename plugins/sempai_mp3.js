let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/sempai.mp3'
conn.sendFile(m.chat, vn, 'sempai.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /hablame|Habla me|Hablame|habla me|Háblame|háblame/ 
handler.command = new RegExp
module.exports = handler
