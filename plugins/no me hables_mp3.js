let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/no me hables.mp3'
conn.sendFile(m.chat, vn, 'no me hables.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /No me hables|no me hables/ 
handler.command = new RegExp
module.exports = handler
