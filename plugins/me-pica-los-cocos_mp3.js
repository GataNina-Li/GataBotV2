let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/me-pica-los-cocos.mp3'
conn.sendFile(m.chat, vn, 'me-pica-los-cocos.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Me pica|ME PICA|me pica|Me pican|ME PICAN|me pican/i
handler.command = new RegExp
module.exports = handler
