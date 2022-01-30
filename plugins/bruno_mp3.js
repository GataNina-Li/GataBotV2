let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Bruno.mp3'
conn.sendFile(m.chat, vn, 'Bruno.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true
})
}
handler.customPrefix = /bruno|Bruno|Bruno Sobrino|bruno sobrino/
handler.command = new RegExp
module.exports = handler
