let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/navidad.m4a'
conn.sendFile(m.chat, vn, 'navidad.m4a', null, m, true, {
type: 'audioMessage', // paksa tanpa convert di ffmpeg
ptt: true // true diatas ga work, sebab dipaksa tanpa convert ;v
})
}
handler.customPrefix = /Feliz navidad|feliz navidad|Merry Christmas|merry chritmas/ 
handler.command = new RegExp
module.exports = handler
