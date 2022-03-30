let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/mmm.mp3'
conn.sendFile(m.chat, vn, 'mmm.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /mmm|Mmm|MmM/ 
handler.command = new RegExp
module.exports = handler
