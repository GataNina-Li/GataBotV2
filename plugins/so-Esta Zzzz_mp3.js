let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Esta Zzzz.mp3'
conn.sendFile(m.chat, vn, 'Esta Zzzz.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Zzzz/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
