let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/violin.mp3'
conn.sendFile(m.chat, vn, 'violin.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Estoy triste|ESTOY TRISTE|estoy triste|Triste|TRISTE|triste|Troste|TROSTE|troste|Truste|TRUSTE|truste/i
handler.command = new RegExp 
module.exports = handler
