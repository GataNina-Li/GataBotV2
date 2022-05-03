let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Ya antojaron.mp3'
conn.sendFile(m.chat, vn, 'Ya antojaron.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Goku pervertido|pervertido/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
