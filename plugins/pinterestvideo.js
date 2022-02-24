const { pin } = require('../lib/scrape')

let handler = async (m, { conn, args, usedPrefix, command }) => {

    if (!args[0]) throw `*Este comando para descargar videos de pinterest se debe usar con link del video*\n\n*Ejemplo:*\n${usedPrefix + command} https://id.pinterest.com/pin/267893877823775677/`
    if (!args[0].match(/https:\/\/.*pinterest.com\/pin|pin.it/gi)) throw `*¡Link incorrecto! Este comando para descargar videos de pinterest se debe usar con link del video*\n\n*Ejemplo:*\n${usedPrefix + command} https://id.pinterest.com/pin/267893877823775677/`

    pin(args[0]).then(async res => {
        let pin = JSON.stringify(res)
        let json = JSON.parse(pin)
        if (!json.status) throw `*El video no se pudo descargar*`
        await conn.sendVideo(m.chat, json.data.url, `🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈`, m, { thumbnail: Buffer.alloc(0) })
    })

}
handler.help = ['pinterestvideo'].map(v => v + ' <url>') 
handler.tags = ['downloader']
handler.command = /^pinterestvideo|pintvid|pinterestvid$/i

handler.limit = false

module.exports = handler
