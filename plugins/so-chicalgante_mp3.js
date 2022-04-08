let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/chica lgante.mp3'
conn.sendFile(m.chat, vn, 'chica lgante.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true
})
}
handler.customPrefix = /Me olvide|ME OLVIDE|me olvide|Me olvidé|me olvidé|ME OLVIDÉ/ 
handler.command = new RegExp
module.exports = handler

