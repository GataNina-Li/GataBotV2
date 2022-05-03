let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/El Toxico.mp3'
conn.sendFile(m.chat, vn, 'El Toxico.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /El Toxico|El tóxico/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
