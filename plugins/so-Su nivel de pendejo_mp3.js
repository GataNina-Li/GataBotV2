let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Su nivel de pendejo.mp3'
conn.sendFile(m.chat, vn, 'Su nivel de pendejo.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Su nivel de pendejo| pendeja/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
