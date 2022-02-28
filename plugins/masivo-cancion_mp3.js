let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/masivo-cancion.mp3'
conn.sendFile(m.chat, vn, 'masivo-cancion.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /MA MA MASIVO|ma ma masivo|Ma ma masivo|Bv|BV|bv|masivo|Masivo|MASIVO/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
