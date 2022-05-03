let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/En caso de una investigación'
conn.sendFile(m.chat, vn, 'En caso de una investigación', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /En caso de una investigación|En caso de una investigacion/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
