let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/no chu.mp3'
conn.sendFile(m.chat, vn, 'no chu.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /No chupa la|No chupala|no chupala|No chu|no chu/ 
handler.command = new RegExp
module.exports = handler
