let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/la-voz-de-hombre.mp3'
conn.sendFile(m.chat, vn, 'la-voz-de-hombre.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /La voz de hombre|la voz de hombre|La voz del hombre|la voz del hombre|La voz|la voz/ 
handler.command = new RegExp
module.exports = handler
