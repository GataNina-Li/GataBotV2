let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Es putoo.mp3'
conn.sendFile(m.chat, vn, 'Es putoo.mp3', null, m, true, {
type: 'audioMessage', // paksa tanpa convert di ffmpeg
ptt: true // true diatas ga work, sebab dipaksa tanpa convert ;v
})
}
handler.customPrefix = /es puto|eeesss putoo|es putoo|esputoo/i
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler