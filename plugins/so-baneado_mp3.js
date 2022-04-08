let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/baneado.mp3'
conn.sendFile(m.chat, vn, 'baneado.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /baneado|Baneado/ 
handler.command = new RegExp
module.exports = handler

