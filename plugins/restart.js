let { spawn }  = require('child_process');
let handler  = async (m, { conn }) => {
  if (!process.send) throw 'Dont: node main.js\nDo: node index.js'
  if (global.conn.user.jid == conn.user.jid) {
    await m.reply('*Restableciendo el Bot...*\n\n*Espere alrededor de 1 minuto*')
    await global.DATABASE.save()
    process.send('reset')
  } else throw '*_Espere un momento antes de vover a usar este comando*'
}
handler.help = ['restart']
handler.tags = ['host']
handler.command = /^restart$/i 
handler.rowner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

