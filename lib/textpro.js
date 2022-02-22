let fetch = require('node-fetch');
let ftype = require('file-type'); 

let handler = async(m, { conn, text }) => {
    let [t1, t2] = text.split `|`
    let str = `
Nih Ngab
`.trim()

    if (!t1) return conn.reply(m.chat, 'Silahkan masukan parameter text1', m)
    if (!t2) return conn.reply(m.chat, 'Silahkan masukan parameter text2', m)

  await m.reply('Sedang membuat...')

            let apikey = ('CPt01blLPQ12Zxt51n0Gf18jQqwEr3Vr')
            let buff = await (await fetch('https://i.ibb.co/MVcHP7k/IMG-20210307-WA1001.jpg')).buffer()

     conn.sendFile(m.chat, buff, 'foto.jpg', str, m)
}
handler.help = ['glitchtext <teks|teks>']
handler.tags = ['creator']
handler.command = /^(glitchtext)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = false

module.exports = handler
