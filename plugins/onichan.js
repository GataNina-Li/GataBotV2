let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Onichan.mp3'
conn.sendFile(m.chat, vn, 'Onichan.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /oni-chan|onichan|o-onichan/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
