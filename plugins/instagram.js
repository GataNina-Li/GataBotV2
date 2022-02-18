let fetch = require('node-fetch')

let handler = async (m, { conn, command, args, usedPrefix }) => {
    if (!args[0]) throw `uhm.. urlnya mana?\n\npenggunaan:\n${usedPrefix + command} url\ncontoh:\n${usedPrefix + command} https://www.instagram.com/p/COaLQGnJFUn/`
    if (!/https?:\/\/(www\.)?instagram\.com\/(.*\/)?(p|reel|tv|stories)/i.test(args[0])) throw `url salah! yang bisa post, reels, tv and story`
    if (/https?:\/\/(www\.)?instagram\.com\/(.*\/)?(stories)/i.test(args[0])) {
        let res = await fetch(API('amel', '/igs', { url: args[0] }, 'apikey'))
        if (!res.ok) throw eror
        let json = await res.json()
        if (!json.status) throw json
        await m.reply(wait)
        for (let { url, type } of json.data) {
            await conn.sendFile(m.chat, url, 'igs' + (type == 'jpg' ? '.jpg' : '.mp4'), '', m)
        }
    }
    if (/https?:\/\/(www\.)?instagram\.com\/(.*\/)?(p|reel|tv)/i.test(args[0])) {
        let res = await fetch(API('amel', '/ig', { url: args[0] }, 'apikey'))
        if (!res.ok) throw eror
        let json = await res.json()
        if (!json.status) throw json
        await m.reply(wait)
        for (let { url, fileType } of json.data) {
            await conn.sendFile(m.chat, url, 'ig' + (fileType == 'image' ? '.jpg' : '.mp4'), '', m)
        }
    }
}
handler.help = ['instagram'].map(v => v + ' <url>')
handler.tags = ['download']
handler.command = /^(instagram|ig)$/i

handler.limit = 1

module.exports = handler
