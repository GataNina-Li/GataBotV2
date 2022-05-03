let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Calla Fan de BTS.mp3'
conn.sendFile(m.chat, vn, 'Calla Fan de BTS.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Calla Fan de bts/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
