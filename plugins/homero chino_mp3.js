let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Homero chino.mp3'
conn.sendFile(m.chat, vn, 'Homero chino.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Homero chino|homero chino|Omero chino|omero chino|Homero Chino/ 
handler.command = new RegExp
module.exports = handler
