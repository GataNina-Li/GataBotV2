let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/vivan.mp3'
conn.sendFile(m.chat, vn, 'vivan.mp3', null, m, true, {
type: 'audioMessage', // paksa tanpa convert di ffmpeg
ptt: true // true diatas ga work, sebab dipaksa tanpa convert ;v
})
}
handler.customPrefix = /vivan!!|vivan los novios|vivanlosnovios/i
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler

