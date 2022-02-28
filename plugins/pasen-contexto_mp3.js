let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/contexto.mp3'
conn.sendFile(m.chat, vn, 'contexto.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Contexto|CONTEXTO|contexto|Pasen contexto|PASEN CONTEXTO|pasen contexto|Y el contexto|Y EL CONTEXTO|y el contexto/i
handler.command = new RegExp
module.exports = handler 
