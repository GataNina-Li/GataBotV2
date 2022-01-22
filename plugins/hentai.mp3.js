let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/hentai.mp3'
conn.sendFile(m.chat, vn, 'hentai.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true
})
}
handler.customPrefix = /audio hentai|Audio hentai|audiohentai|Audiohentai/i
handler.command = new RegExp

module.exports = handler