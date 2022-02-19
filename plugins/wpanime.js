let fetch = require('node-fetch')

let handler = async (m, { conn, command, usedPrefix, text }) => {
    if (!text) throw `teksnya mana?\n\n${usedPrefix + command} amel|cantik`
    let text1 = text.split`|`[0]
    let text2 = text.split`|`[1]
    if (!text1) throw `teks nya mana?\n\n${usedPrefix + command} amel|cantik`
    if (!text2) throw `teks2 nya mana?\n\n${usedPrefix + command} amel|cantik`
    let res = await fetch(API('amel', '/textpro/grafity', { text: text1, text2 }, 'apikey'))
    if (!res.ok) throw eror
    let img = await res.buffer()
    if (!img) throw img
    conn.sendFile(m.chat, img, 'grafity.jpg', wm, m)
}
handler.help = ['grafity'].map(v => v + ' <teks>|<teks2>')
handler.tags = ['maker']
handler.command = /^(grafity)$/

module.exports = handler
