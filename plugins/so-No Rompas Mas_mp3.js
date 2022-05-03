let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/No Rompas Mas.mp3'
conn.sendFile(m.chat, vn, 'No Rompas Mas.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /No Rompas más|No Rompas mas|💔/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
