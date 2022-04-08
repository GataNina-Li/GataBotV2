let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Fiesta1.mp3'
conn.sendFile(m.chat, vn, 'Fiesta1.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /fiesta del admin 3|atención grupo|atencion grupo|aviso importante|fiestadeladmin3|fiesta en casa de uriel/i 
handler.command = new RegExp



handler.fail = null
handler.exp = 100
module.exports = handler

