let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/pero-esto-ya-es-otro-nivel.mp3'
conn.sendFile(m.chat, vn, 'pero-esto-ya-es-otro-nivel.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Pero esto|pero esto|Pero esto ya es otro nivel|pero esto ya es otro nivel|Otro nivel|otro nivel/ 
handler.command = new RegExp
module.exports = handler
