let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Momento equisde.mp3'
conn.sendFile(m.chat, vn, 'Momento equisde.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Momento equisde|momento equisde|Momento xd|Momento XD/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
