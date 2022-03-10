let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/pikachu.mp3'
conn.sendFile(m.chat, vn, 'pikachu.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /PIKA|pica|Pica|Pikachu|pikachu|PIKACHU|picachu|Picachu/ 
handler.command = new RegExp
module.exports = handler
