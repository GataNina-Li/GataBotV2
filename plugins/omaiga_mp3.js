let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/omaiga.mp3'
conn.sendFile(m.chat, vn, 'omaiga.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /OMAIGA|OMG|omg|omaiga|Omg|Omaiga|OMAIGA/ 
handler.command = new RegExp
module.exports = handler
