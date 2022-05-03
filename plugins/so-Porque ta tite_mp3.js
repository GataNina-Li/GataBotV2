let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Porque ta tite.mp3'
conn.sendFile(m.chat, vn, 'Porque ta tite.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Porque ta tite|Por qué ta tite/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
