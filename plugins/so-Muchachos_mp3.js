let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Muchachos.mp3'
conn.sendFile(m.chat, vn, 'Muchachos.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Muchachos/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
