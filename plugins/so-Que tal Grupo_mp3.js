let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Que tal Grupo.mp3'
conn.sendFile(m.chat, vn, 'Que tal Grupo.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Que tal Grupo|qué tal grupo/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
