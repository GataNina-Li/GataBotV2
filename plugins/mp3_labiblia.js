let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/ora.mp3'
conn.sendFile(m.chat, vn, 'ora.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true
})
}
handler.customPrefix = /laoracion|La biblia|La oración|La biblia|La oración|la biblia|La Biblia/ 
handler.command = new RegExp
module.exports = handler
