let fetch = require('node-fetch')
async function getRandom(url) {
return Math.floor(Math.random() * url)
}
let handler  = async (m, { conn }) => {
conn.sendFile(m.chat, `https://recoders-area.caliph.repl.co/api/lolivid`, '', ``, m)
}
handler.command = /^(lolivid|lolivideo)$/i

module.exports = handler
