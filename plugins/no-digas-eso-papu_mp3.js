let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/no-digas-eso-papu.mp3'
conn.sendFile(m.chat, vn, 'no-digas-eso-papu.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /NO DIGAS ESO PAPU|no digas eso papu|No gigas eso papu|NO PAPU|No papu|NO papu|no papu/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
