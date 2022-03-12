let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/jai.mp3'
conn.sendFile(m.chat, vn, 'jai.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Hey|Hei|hey|HEY/i
handler.command = new RegExp
module.exports = handler 
