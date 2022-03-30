let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/abduzcan.mp3'
conn.sendFile(m.chat, vn, 'abduzcan.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /abduzcan|Abduzcan|adbuzcan|Adbuzcan/ 
handler.command = new RegExp
module.exports = handler
