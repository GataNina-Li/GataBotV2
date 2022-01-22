const connect = require('./connect')
const chalk = require('chalk')

const samu330 = connect.samu330


exports.runtime = () => {
    seconds = process.uptime()
    seconds = Number(seconds)
    var d = Math.floor(seconds / (3600 * 24))
    var h = Math.floor(seconds % (3600 * 24) / 3600)
    var m = Math.floor(seconds % 3600 / 60)
    var s = Math.floor(seconds % 60)
    var dDisplay = d > 0 ? d + (d == 1 ? " dia, " : " dias, ") : ""
    var hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " horas, ") : ""
    var mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " minutos, ") : ""
    var sDisplay = s > 0 ? s + (s == 1 ? " segundo " : " segundos ") : ""
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

exports.stats = (totalchat1) => {
    let i = []
    let giid = []
    for (mem of totalchat1) {
        i.push(mem.jid)
    }
    for (id of i) {
        if (id && id.includes('g.us')) {
            giid.push(id)
        }
    }
    const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = samu330.user.phone
    text = `*WA Version :* ${wa_version}
*RAM :* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
*MCC :* ${mcc}
*MNC :* ${mnc}
*Version OS :* ${os_version}
*Modelo HP :* ${device_manufacturer}
*Version HP :* ${device_model}
*Group Chat :* ${giid.length}
*Personal Chat :* ${totalchat1.length - giid.length}
*Total Chat :* ${totalchat1.length}
*Runtime :* ${this.runtime()}`
    return text
}


exports.FakeStatusImgForwarded = (from, image, caption) => {
	samu330.sendMessage(from, image, MessageType.image, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "mimetype": "image/jpeg", "caption": '➫𝗦𝗮𝗺 𝘆 𝗣𝗲𝗿𝗿𝘆🔥❣️', "jpegThumbnail": fs.readFileSync(`./src/help.jpeg`)} } }, caption: '𝒩𝓎𝒶𝓃ℬ𝑜𝓉💓', contextInfo: {"forwardingScore": 999, "isForwarded": true} })
}


exports.admin = (list, groupName) => {
    var text = `╭───「 Admin 」
│
├❏ Group : ${groupName}
├❏ Total : ${list.length} admin(s)
│
`
    for (var x of list) {
        text += `├❏ @${x.split("@")[0]}\n`
    }
    text += `│
╰───「 Samu330 」
`
    return text
}
