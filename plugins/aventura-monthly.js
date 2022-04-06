let { MessageType } = require('@adiwajshing/baileys')
const cooldown = 2592000000
let handler = async (m, { conn, usedPrefix, command }) => {
    let user = global.DATABASE._data.users[m.sender]
    let _timers = (cooldown - (new Date - user.lastmonthly))
    let timers = clockString(_timers)
    if (new Date - user.lastmonthly > cooldown) {
        conn.reply(m.chat, `Has reclamado 100000 de dinero, 5 cajas legendarias y 3 cajas de mascotas`, m)
        user.money += 100000
        user.legendary += 5
        user.pet += 3
        user.lastmonthly = new Date * 1
    } else {
        let buttons = button(`Espere *${timers}* para volver a reclamar`, user)
        conn.sendMessage(m.chat, buttons, MessageType.buttonsMessage, { quoted: m })
    }
}
handler.help = ['monthly']
handler.tags = ['rpg']
handler.command = /^(monthly)$/i

handler.cooldown = cooldown

module.exports = handler

function clockString(seconds) {
  d = Math.floor(seconds / (1000 * 60 * 60 * 24));
  h = Math.floor((seconds / (1000 * 60 * 60)) % 24);
  m = Math.floor((seconds / (1000 * 60)) % 60);
  s = Math.floor((seconds / 1000) % 60);
  
  dDisplay = d > 0 ? d + (d == 1 ? " dia," : " Dias,") : "";
  hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " Horas, ") : "";
  mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " Minutos, ") : "";
  sDisplay = s > 0 ? s + (s == 1 ? " segundo" : " Segundos") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

function button(teks, user) {
    const buttons = []

    let claim = new Date - user.lastclaim > 86400000
    let monthly = new Date - user.lastmonthly > 2592000000
    let weekly = new Date - user.lastweekly > 604800000
    console.log({ claim, monthly, weekly })

    if (monthly) buttons.push({ buttonId: `.monthly`, buttonText: { displayText: 'Reclamo del mes 🎑' }, type: 1 })
    if (weekly) buttons.push({ buttonId: `.weekly`, buttonText: { displayText: '🎁 Reclamo de la semana' }, type: 1 })
    if (claim) buttons.push({ buttonId: `.daily`, buttonText: { displayText: 'Reclamo del día 🌤️' }, type: 1 })
    if (buttons.length == 0) throw teks

    const buttonMessage = {
        contentText: teks,
        footerText: '*©Cᴏᴍᴘᴀɴʏ Zᴇɴ Bᴏᴛ*',
        buttons: buttons,
        headerType: 1
    }

    return buttonMessage
}
