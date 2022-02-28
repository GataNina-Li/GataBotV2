let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Elmo.mp3'
conn.sendFile(m.chat, vn, 'Elmo.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Pasa pack|vendes tu nudes|pasa video hot|pasa tu pack|pasa fotos hot|vendes tu pack|Vendes tu pack|Vendes tu pack?|vendes tu pack|Pasa Pack Bot|pasa pack Bot|pasa tu pack Bot|Pásame tus fotos desnudas|pásame tu pack|me pasas tu pak|me pasas tu pack|pasa pack/
handler.command = new RegExp
module.exports = handler 
