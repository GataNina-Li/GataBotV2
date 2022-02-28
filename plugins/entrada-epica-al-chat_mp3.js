let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/entrada-epica-al-chat.mp3'
conn.sendFile(m.chat, vn, 'entrada-epica-al-chat.mp3', null, m, true, {
type: 'audioMessage', // paksa tanpa convert di ffmpeg
ptt: true // true diatas ga work, sebab dipaksa tanpa convert ;v
})
}
handler.customPrefix = /ENTRADA|entrada|Entrada|Entra|ENTRA|Entra|Ingresa|ingresa|INGRESA|ingresar|INGRESAR|Ingresar/i 
handler.command = new RegExp
module.exports = handler
