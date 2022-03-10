let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/suspenso.mp3'
conn.sendFile(m.chat, vn, 'suspenso.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Suspenso|suspenso/ 
handler.command = new RegExp
module.exports = handler
