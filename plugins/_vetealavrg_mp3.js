let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/vete a la verga.mp3'
conn.sendFile(m.chat, vn, 'vete a la verga.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /vetealavrg|vete a la vrg|vete a la verga/i
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler

