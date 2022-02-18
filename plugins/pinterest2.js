let handler = async (m, { conn, command, text, usedPrefix, isPrems }) => {
    let chat = db.data.chats[m.chat]
    if (chat.download) {
        await conn.sendButton(m.chat, 'turn off auto download to use this command', wm, 'Off', '.0 download', m)
        throw 0
    }
    if (!text) throw `uhm.. where the url?\n\nusage:\n${usedPrefix + command} ${isPrems ? 'url, url, ...' : 'url'}\nexample:\n${usedPrefix + command} https://pin.it/4NwPw8E`
    if (!/https?:\/\/(www\.)?(pinterest\.com\/pin|pin\.it)/i.test(text)) throw `wrong url!`
    if (isPrems) {
        let array = text.split(',')
        await m.reply(`downloading ${array.length > 1 ? array.length + ' medias' : 'media'} from pinterest`)
        for (let url of array) {
            let json = await amel.pin(url.trim()).then(res => {
                let json = JSON.parse(JSON.stringify(res))
                console.log(json)
                return json
            })
            await conn.sendFile(m.chat, json.data[0].url, json.data[0].url, '', m)
        }
        return !0
    }
    let json = await amel.pin(text).then(async res => {
        let json = JSON.parse(JSON.stringify(res))
        console.log(json)
        return json
    })
    await m.reply('downloading media from pinterest')
    await conn.sendFile(m.chat, json.data[0].url, json.data[0].url, '', m)
}
handler.help = ['pinterest'].map(v => v + ' <url>')
handler.tags = ['internet']
handler.command = /^(pinterest|pin)$/i

handler.limit = 1

module.exports = handler
