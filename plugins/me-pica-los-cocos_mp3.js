let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/me-pican-los-cocos.mp3'
conn.sendFile(m.chat, vn, 'me-pican-los-cocos.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Me pica los cocos|ME PICA |me pica|Me pican los cocos|ME PICAN/i 
handler.command = new RegExp
module.exports = handler
