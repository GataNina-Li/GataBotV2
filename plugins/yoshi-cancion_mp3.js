let util = require('util')
let path = require('path') 

let handler = async (m, { conn }) => {
let vn = './media/yoshi-cancion.mp3'
conn.sendFile(m.chat, vn, 'yoshi-cancion.mp3', null, m, true, {
type: 'audioMessage', // paksa tanpa convert di ffmpeg
ptt: true // true diatas ga work, sebab dipaksa tanpa convert ;v
})
}
handler.customPrefix = /YOSHI|Yoshi|YoShi|yoshi|/i
handler.command = new RegExp
module.exports = handler
