let { MessageType } = require('@adiwajshing/baileys')

let confirm = {}

async function handler(m, { conn, args, isROwner }) {
    //if (!isROwner) throw 'Dalam perbaikan'
    if (m.sender in confirm) throw 'Kamu masih melakukan judi, tunggu sampai selesai!!'
    try {
        let user = global.DATABASE._data.users[m.sender]
        let count = (args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(parseInt(user.money)) : 1) * 1
        if ((user.money * 1) < count) return conn.sendMessage(m.chat, button('*Tu dinero no es suficiente para apostar*', user), MessageType.buttonsMessage, { quoted: m })
        if (!(m.sender in confirm)) {
            confirm[m.sender] = {
                sender: m.sender,
                count,
                timeout: setTimeout(() => (m.reply('timed out'), delete confirm[m.sender]), 60000)
            }
            let txt = '*🤔 Estas seguro/a de que desea apostar?*'
            const buttons = [
                {buttonId: `id1`, buttonText: {displayText: 'Si'}, type: 1},
                {buttonId: `id2`, buttonText: {displayText: 'No'}, type: 1}
            ]

            const buttonMessage = {
                contentText: txt,
                footerText: 'Elija una opcion, tienes 60 segundos\n*Gata Dios*',
                buttons: buttons,
                headerType: 1
            }
            return conn.sendMessage(m.chat, buttonMessage, MessageType.buttonsMessage, { quoted: m })
        }
    } catch (e) {
        if (m.sender in confirm) {
            let { timeout } = confirm[m.sender]
            clearTimeout(timeout)
            delete confirm[m.sender]
            m.reply('Se acabo el tiempo! 😬')
        }
    }
}

handler.before = async m => {
    if (!(m.sender in confirm)) return 
    if (m.isBaileys) return 
    let { timeout, count } = confirm[m.sender]
    let user = global.DATABASE._data.users[m.sender]
    let moneyDulu = user.money * 1
    let txt = (m.msg && m.msg.selectedDisplayText ? m.msg.selectedDisplayText : m.text ? m.text : '').toLowerCase()
    try {
        if (/^(si|Si)$/i.test(txt)) {
            let Bot = (Math.ceil(Math.random() * 100)) * 1
            let Kamu = (Math.floor(Math.random() * 86)) * 1
            let status = 'Pierdes!'
            if (Bot < Kamu) {
                user.money += count * 1
                status = 'Ganas!'
            } else if (Bot > Kamu) {
                user.money -= count * 1
            } else {
                status = 'Seri'
                user.money += (Math.floor(count / 1.5)) * 1
            }
            m.reply(`
💸 *APUESTA* 💸

🦾 Bot roll: *${Bot}*
💪 Usted roll: *${Kamu}*

Tú *${status}* ${status == 'Ganas!' ? `*+${count * 8}*` : status == 'Pierdes!' ? ` *-${count * 3}*` : `*+${Math.floor(count / 1.5)}*`} de dinero.
`.trim())
            clearTimeout(timeout)
            delete confirm[m.sender]
            return !0
        } else if (/^(no|No)$/i.test(txt)) {
            clearTimeout(timeout)
            delete confirm[m.sender]
            m.reply('*Tú te lo pierdes* 😌✨')
            return !0
        }

    } catch (e) {
        clearTimeout(timeout)
        delete confirm[m.sender]
        if (moneyDulu > (user.money * 1)) user.money = moneyDulu * 1
        m.reply('Error al apostar (Tú te lo pierdes 😌✨)')
        return !0
    } finally {
        clearTimeout(timeout)
        delete confirm[m.sender]
        return !0
    }
}
  
handler.help = ['apostar']
handler.tags = ['rpg']
handler.command = /^(apostar)$/i

module.exports = handler

/**
 * Detect if thats number
 * @param {Number} x 
 * @returns Boolean
 */
function number(x = 0) {
    x = parseInt(x)
    return !isNaN(x) && typeof x == 'number'
}

function button(teks, user) {
    let buttons = []
    
    let claim = new Date - user.lastclaim > 86400000
    let monthly = new Date - user.lastmonthly > 2592000000
    let weekly = new Date - user.lastweekly > 604800000
    let adventure = new Date - user.lastadventure > 300000
    let mining = new Date - user.lastmining > 300000
    console.log({claim, monthly, weekly, adventure, mining})

    if (monthly) buttons.push({buttonId: `.monthly`, buttonText: {displayText: 'Reclamo del mes 🎑'}, type: 1})
    if (weekly) buttons.push({buttonId: `.weekly`, buttonText: {displayText: '🎁 Reclamo de la semana'}, type: 1})
    if (claim) buttons.push({buttonId: `.daily`, buttonText: {displayText: 'Reclamo del día'}, type: 1})
    if (adventure) buttons.push({buttonId: `.adventure`, buttonText: {displayText: 'Aventura 🏔️'}, type: 1})
    if (mining) buttons.push({buttonId: `.mining`, buttonText: {displayText: 'Minar ⛏'}, type: 1})
    if (buttons.length == 0) throw teks
    
    const buttonMessage = {
        contentText: teks,
        footerText: '*©Cᴏᴍᴘᴀɴʏ Zᴇɴ Bᴏᴛ*',
        buttons: buttons,
        headerType: 1
    }
    
    return buttonMessage
}
