let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/esto va a hacer epico papus.mp3'
conn.sendFile(m.chat, vn, 'esto va a hacer epico papus.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Esto va ser épico papus|esto va ser épico papus|Esto va ser|Esto va a hacer|esto va acer|Esto va aser|esto va ser|esto va a hacer/i 
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
