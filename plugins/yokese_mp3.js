let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/yokese.mp3'
conn.sendFile(m.chat, vn, 'yokese.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Yokese|yokese|YOKESE/ 
handler.command = new RegExp
module.exports = handler
