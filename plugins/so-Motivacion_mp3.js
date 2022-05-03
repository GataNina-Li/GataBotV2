let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Motivacion.mp3'
conn.sendFile(m.chat, vn, 'Motivacion.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Motivacion|Motivación/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
