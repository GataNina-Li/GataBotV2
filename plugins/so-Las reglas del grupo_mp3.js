let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Las reglas del grupo.mp3'
conn.sendFile(m.chat, vn, 'Las reglas del grupo.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Las reglas del grupo/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
