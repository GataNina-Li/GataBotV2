let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Y este quien es.mp3'
conn.sendFile(m.chat, vn, 'Y este quien es.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Y este quien es|Y este quien poronga es|Y este quien porongas es/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
