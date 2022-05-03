let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Elmo sabe donde vives.mp3'
conn.sendFile(m.chat, vn, 'Elmo sabe donde vives.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Elmo sabe donde vives/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
