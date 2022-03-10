let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/fino-senores.mp3'
conn.sendFile(m.chat, vn, 'fino-senores.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Fino señores|fino señores|Fino senores|fino senores|Fino/i 
handler.command = new RegExp 

handler.fail = null
handler.exp = 100
module.exports = handler
