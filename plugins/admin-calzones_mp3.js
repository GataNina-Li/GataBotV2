let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/admin-calzones.mp3'
conn.sendFile(m.chat, vn, 'admin-calzones.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /TENGO LOS CALZONES|Tengo los calzones|tengo los calzones/i 
handler.command = new RegExp
module.exports = handler
