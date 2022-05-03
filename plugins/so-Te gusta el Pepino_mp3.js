let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Te gusta el Pepino.mp3'
conn.sendFile(m.chat, vn, 'Te gusta el Pepino.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Te gusta el Pepino|🥒/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
