let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/risa.mp3'
conn.sendFile(m.chat, vn, 'risa.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /xD|XD|Jajaja|JAJAJA|jajaja|Lol|LOL|lol|._.XD|XD._./i
handler.command = new RegExp
module.exports = handler
