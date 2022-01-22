let fetch = require('node-fetch')

let handler = async(m, { conn, args, usedPrefix, command }) => {
  fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/blackpink.txt').then(res => res.text()).then(body => {
    let randomkpop = body.split('\n')
    let randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
    conn.sendFile(m.chat, randomkpopx, '', '', m)
  }).catch(() => {
    conn.reply(m.chat, `*[ ERROR ]*\n\n${command} no se puede utilizar`, m)
  })

}

handler.help = ['blackpink']
handler.tags = ['images']
handler.command = /^(blackpink)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 1000
handler.limit = false

module.exports = handler
