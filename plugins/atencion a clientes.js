let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/insultar.mp3'
conn.sendFile(m.chat, vn, 'insultar.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true
})
}
handler.customPrefix = /bot puto|Bot puto|Bot CTM|Bot ctm|bot CTM|bot ctm|bot pendejo|Bot pendejo|Bot gay|bot de mierda/
handler.command = new RegExp
module.exports = handler
