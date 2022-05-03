let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/tunometecabrasaramambiche.mp3'
conn.sendFile(m.chat, vn, 'tunometecabrasaramambiche.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /tunometecabrasaramambiche/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
