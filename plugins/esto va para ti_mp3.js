let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/esto va para ti.mp3'
conn.sendFile(m.chat, vn, 'esto va para ti.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Esto va para ti|esto va para ti/ 
handler.command = new RegExp
module.exports = handler
