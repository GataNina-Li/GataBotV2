let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/verdad-que-te-engane.mp3'
conn.sendFile(m.chat, vn, 'verdad-que-te-engane.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Verdad que te engañe|verdad que te engañe|verdad que|Verdad que/i 
handler.command = new RegExp 

handler.fail = null
handler.exp = 100
module.exports = handler
