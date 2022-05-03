let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/A bueno adios master.mp3'
conn.sendFile(m.chat, vn, 'A bueno adios master.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Bueno master|🫂/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
