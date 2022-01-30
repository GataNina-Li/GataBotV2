let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/vivan.mp3'
conn.sendFile(m.chat, vn, 'vivan.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /vivan!!|vivan los novios|vivanlosnovios/i
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler

