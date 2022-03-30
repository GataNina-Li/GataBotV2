let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/pokemon.mp3'
conn.sendFile(m.chat, vn, 'pokemon.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /Pokemon|pokemon|Pokémon|pokémon/ 
handler.command = new RegExp
module.exports = handler
