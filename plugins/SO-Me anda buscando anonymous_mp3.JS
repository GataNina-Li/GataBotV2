let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Me anda buscando anonymous.mp3'
conn.sendFile(m.chat, vn, 'Me anda buscando anonymous.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Me anda buscando anonymous|me anda buscando anonymous|Me está buscando anonymous|me está buscando anonymous/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
