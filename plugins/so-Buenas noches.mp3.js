let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Buenas noches.mp3'
conn.sendFile(m.chat, vn, 'Buenas noches.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Buenas noches/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
