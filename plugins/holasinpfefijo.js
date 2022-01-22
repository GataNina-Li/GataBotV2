let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Hola.mp3'
conn.sendFile(m.chat, vn, 'Hola.mp3', null, m, true, {
type: 'audioMessage', // paksa tanpa convert di ffmpeg
ptt: true // true diatas ga work, sebab dipaksa tanpa convert ;v
})
}
handler.help = ['pengumuman','hidetag'].map(v => 'o' + v + ' [teks]')
handler.tags = ['owner']
handler.command = /^(hola|ola)$/i

module.exports = handler