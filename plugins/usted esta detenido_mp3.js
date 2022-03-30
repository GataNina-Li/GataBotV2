let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/usted esta detenido.mp3'
conn.sendFile(m.chat, vn, 'usted esta detenido.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Usted esta detenido|usted esta detenido|usted está detenido|Usted está detenido/ 
handler.command = new RegExp
module.exports = handler
