let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/joder.mp3'
conn.sendFile(m.chat, vn, 'joder.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Joder|joder/ 
handler.command = new RegExp
module.exports = handler
