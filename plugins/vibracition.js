let { MessageType, Presence, mimetype } = require('@adiwajshing/baileys')
let ffmpeg = require('fluent-ffmpeg');
let fetch = require('node-fetch');
let ftype = require('file-type');
let fs = require('fs');
let { exec } = require('child_process');

let handler = async(m, { conn, text, args }) => {
if (!text) throw '*_Cuanto desea ponerle?_*\n*_Use un numero entre el 1 y el 100_*\n\n*_Ejemplo: #vibracion 10_*\n\n*_Nota: Recuerde responder a un audio o nota de voz_*'
     await m.reply('Procesando audio...')
          if (!m.quoted) return conn.reply(m.chat, 'Responda a un audio o nota de voz!', m)
          let type = Object.keys(m.message)[0]
          let content = JSON.stringify(m.message)
          let isMedia = (type === 'imageMessage' || type === 'videoMessage')
          let isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
                  if (!isQuotedAudio) return m.reply('Itu Audio?')
                                let encmedia = JSON.parse(JSON.stringify(m).replace('quotedM','m')).message.extendedTextMessage.contextInfo
                                let media = await conn.downloadAndSaveMediaMessage(encmedia)
                                  let ran = getRandom('.mp3')
                                    exec(`ffmpeg -i ${media} -filter_complex "vibrato=f=${text}" ${ran}`, (err, stderr, stdout) => {
                                      fs.unlinkSync(media)
                                      if (err) return reply('Ada yang Erorr!')
                                      let tupai = fs.readFileSync(ran)
                                      conn.sendFile(m.chat, tupai, 'tupai.mp3', '', m, false, { ptt: true })
                                      fs.unlinkSync(ran)
           })
}
handler.help = ['vibration (reply audio)']
handler.tags = ['audio']
handler.command = /^(vibracion)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.register = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = false

module.exports = handler

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`
}