let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/UwU.mp3'
conn.sendFile(m.chat, vn, 'UwU.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /UwU|uwu|Uwu|uwU|UWU/
handler.command = new RegExp
module.exports = handler
