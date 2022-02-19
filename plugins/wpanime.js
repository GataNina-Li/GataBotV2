let fetch = require('node-fetch')

let handler = async (m, { conn, usedPrefix, command }) => {
    let res = await fetch(API('amel', '/korea', {}, 'apikey'))
    if (!res.ok) throw eror
    let json = await res.json()
    if (!json.status) throw json
    conn.sendButtonImg(m.chat, json.result, 'Nieh banh', wm, 'lagi', `${usedPrefix + command}`, m)
}
handler.help = ['cecankorea']
handler.tags = ['fun']
handler.command = /^(cecankorea)$/i

module.exports = handler
