let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/suspenso.mp3'
conn.sendFile(m.chat, vn, 'suspenso.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Cagaste|Miedo|miedo|Pvp|PVP|temor|que pasa|Que sucede|Que pasa|que sucede|Qué pasa|Qué sucede|Dime|dime/ 
handler.command = new RegExp
module.exports = handler
