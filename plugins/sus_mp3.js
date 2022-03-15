let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/sus.mp3'
conn.sendFile(m.chat, vn, 'sus.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Sus|sus|Amongos|among us|Among us|Among/i 
handler.command = new RegExp 

handler.fail = null
handler.exp = 100
module.exports = handler
