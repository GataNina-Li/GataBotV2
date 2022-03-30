let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/no me hagas usar esto.mp3'
conn.sendFile(m.chat, vn, 'no me hagas usar esto.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /no me hagas usar esto|No me hagas usar esto|No me agas usar esto/ 
handler.command = new RegExp
module.exports = handler
