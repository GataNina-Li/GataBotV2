let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/una-pregunta.mp3'
conn.sendFile(m.chat, vn, 'una-pregunta.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Una pregunta|una pregunta|WhatsApp|whatsApp|pregunton|preguntona/ 
handler.command = new RegExp
module.exports = handler
