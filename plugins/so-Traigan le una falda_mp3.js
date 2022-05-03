let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Traigan le una falda.mp3'
conn.sendFile(m.chat, vn, 'Traigan le una falda.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Traigan le una falda|Traiganle una falda/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
