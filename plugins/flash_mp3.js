let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/flash.mp3'
conn.sendFile(m.chat, vn, 'flash.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Me voy|me voy|ME VOY|Me fui|me fui|ME FUI|Se fue|se fue|SE FUE|Adios|adios|ADIOS|Chao|chao|CHAO/i 
handler.command = new RegExp
module.exports = handler
