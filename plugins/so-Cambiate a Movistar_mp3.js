let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Cambiate a Movistar.mp3'
conn.sendFile(m.chat, vn, 'Cambiate a Movistar.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Cambiate a Movistar|cambiate a Movistar|cambiate a movistar|Cambiate a movistar/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
