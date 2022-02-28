let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/basado.mp3'
conn.sendFile(m.chat, vn, 'basado.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Cada|Basado|Basada|Basadisimo|BASADO|basado|basada|Que basado|Que basada|que basado/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
