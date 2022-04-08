let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Noche.mp3'
conn.sendFile(m.chat, vn, 'Noche.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true
})
}
handler.customPrefix = /noche de paz|Noche de paz|Noche de amor|noche de amor|Noche de Paz/ 
handler.command = new RegExp
module.exports = handler

