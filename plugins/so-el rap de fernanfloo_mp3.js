let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/el rap de fernanfloo.mp3'
conn.sendFile(m.chat, vn, 'el rap de fernanfloo.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /el rap de fernanfloo/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
