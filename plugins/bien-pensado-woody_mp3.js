let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/bien-pensado-woody.mp3'
conn.sendFile(m.chat, vn, 'bien-pensado-woody.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Bien pensado woody|bien pensado woody|Bien pensado|bien pensado|Bien pensado wudy|bien pensado wudy|Bien pensado Woody|bien pensado Woody|Bien pensado woodi|bien pensado woodi/ 
handler.command = new RegExp
module.exports = handler
