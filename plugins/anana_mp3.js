let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/anana.mp3'
conn.sendFile(m.chat, vn, 'anana.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true
})
}
handler.customPrefix = /So/
handler.command = new RegExp
module.exports = handler
