let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/admin.mp3'
conn.sendFile(m.chat, vn, 'admin.mp3', null, m, true, {
type: 'audioMessage', // paksa tanpa convert di ffmpeg
ptt: true // true diatas ga work, sebab dipaksa tanpa convert ;v
})
}
handler.customPrefix = /Fiesta del admin|fiesta del admin/
handler.command = new RegExp
module.exports = handler