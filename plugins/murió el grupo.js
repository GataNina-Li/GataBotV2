let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Murio.m4a'
conn.sendFile(m.chat, vn, 'Murio.m4a', null, m, true, {
type: 'audioMessage', // paksa tanpa convert di ffmpeg
ptt: true // true diatas ga work, sebab dipaksa tanpa convert ;v
})
}
handler.customPrefix = /Murió el grupo|Murio el grupo|murio el grupo|murió el grupo|Grupo muerto|grupo muerto/
handler.command = new RegExp
module.exports = handler