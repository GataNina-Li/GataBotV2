let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Yamete-kudasai.mp3'
conn.sendFile(m.chat, vn, 'Yamete-kudasai.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true
})
}
handler.customPrefix = /Yamete|yamete|Yamete kudasai|yamete kudasai/ 
handler.command = new RegExp
module.exports = handler
