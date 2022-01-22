let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Bañate.mp3'
conn.sendFile(m.chat, vn, 'Bañate.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true
})
}
handler.customPrefix = /bañate|Bañate/
handler.command = new RegExp
module.exports = handler