let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Hola.mp3'
conn.sendFile(m.chat, vn, 'Hola.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.command = /^(hola|ola)$/i

module.exports = handler
