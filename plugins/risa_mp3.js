let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/risa.mp3'
conn.sendFile(m.chat, vn, 'risa.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Se ríe|SE RÍE|se ríe|Risa|risa|RISAS|risas|RISA|Risas|me río|Me río|ME RÍO|me rio|Me rio|ME RIO/i 
handler.command = new RegExp
module.exports = handler
