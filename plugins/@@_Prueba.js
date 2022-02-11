let fs = require('fs')
let fetch = require('node-fetch')
let menus = fs.readFileSync('./media/bot.mp3')
let moment = require('moment-timezone')
let fakeImage = 'https://telegra.ph/file/2bb90be904abf22615127.jpg'
let safusimage = 'https://i.imgur.com/lcjzety.jpg'
let fakeMessage = 'Bruno Sobrino'
const { MessageType } = require('@adiwajshing/baileys')
let path = require('path')
let levelling = require('../lib/levelling')
let handler = async (m, { conn, usedPrefix }) => {
let timer = moment.tz('Asia/Kolkata').format('HH:mm:ss')
let pp = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  try {
    pp = await conn.getProfilePicture(who)
  } catch (e) {

  } finally {
    let jam = moment.tz('Asia/Kolkata').format('HH')
    var ucapanWaktu = 'Good Morning 🌄'
				if (jam >= '03' && jam <= '10') {
				ucapanWaktu = 'Good Morning 🌄'
				} else if (jam >= '10' && jam <= '13') {
				ucapanWaktu = 'Good Afternoon ☀️'
				} else if (jam >= '13' && jam <= '18') {
				ucapanWaktu = 'Good evening 🌅'
				} else if (jam >= '18' && jam <= '23') {
				ucapanWaktu = 'Good Night 🌙'
				} else {
				ucapanWaktu = 'Good Night 🌙'
				} 
				   let name = conn.getName(m.sender)
    let d = new Date
    let locale = 'en'
				    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
        let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
       let { exp, limit, registered, regTime, level, role } = global.DATABASE.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
       let _uptime = process.uptime() * 1000
 conn.relayWAMessage(conn.prepareMessageFromContent(m.chat, {
        "listMessage": {
          "title": `
*Oi Bro ${ucapanWaktu}*
*👤Name:* ${name}
*👑Level:* ${level}
*💳Money:* ${limit}$
*💎Role:* ${role}
*⌚Time:* ${timer}
*🌏Universel Time:* ${time}
*📡Server:* Digital Ocean
*📦Framework:* Nodejs
*🦄Webinfo:* Baileyes
*🗃️Storage:* 14/16GB`.trim(),
          "description": "Click And Select Your option 🔮",
          "footerText": "©Team MA",
          "buttonText": "Click Here",
          "listType": "SINGLE_SELECT",
          "sections": [
            {
              "rows": [
                {
                  "title": `ALLMENU`,
                  "description": "",
                  "rowId": ".allmenu"     
                }, {       
                  "title": `GROUPINFO`,
                  "description": "",
                  "rowId": ".groupinfo" 
                }, {
                  "title": `BOTRULES`,
                  "description": "",
                  "rowId": ".rules"          
                 }, {
                  "title": `PROFILE`,
                  "description": "",
                  "rowId": ".profile"
                 }, {
                  "title": `INFO`,
                  "description": "",
                  "rowId": ".info"
                 }, {
                  "title": `OWNER`,
                  "description": "",
                  "rowId": ".owner"
                 }, {
                  "title": `CREATORS`,
                  "description": "",
                  "rowId": ".creators"                
                }
              ]
            }
          ], "contextInfo": {
            "stanzaId": m.key.id,
            "participant": m.sender,
            "quotedMessage": m.message
          }
        }
      }, {}), { waitForAck: true })
      }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(prueba)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 100

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
