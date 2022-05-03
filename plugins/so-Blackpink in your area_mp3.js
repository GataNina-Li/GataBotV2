let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Blackpink in your area.mp3'
conn.sendFile(m.chat, vn, 'Blackpink in your area.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Blackpink in your area|blackpink in your area|in your area|In your area/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
