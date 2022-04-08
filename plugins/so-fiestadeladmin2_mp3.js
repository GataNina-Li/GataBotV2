let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/fiesta.mp3'
conn.sendFile(m.chat, vn, 'fiesta.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /fiesta del admin2|fiesta del admin 2|fiestadeladmin2/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler

