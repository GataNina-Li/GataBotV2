let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, args, usedPrefix, command, DevMode }) => {
    if (args.length < 3) {
        return conn.reply(m.chat, `*Ejemplo, uso del comando*\n• ${usedPrefix + command} <tipo> <cantidad> <@tag>\n\n- Ejemplo: ${usedPrefix + command} dinero 100 @tag\n\n*Tipos de transferencias:*\n\n- Dinero\n- Diamante\n- Pocion\n- Basura\n- Comun\n- Normal\n- Mitico\n- Legendario`.trim(), m)
    } else try {
        let type = (args[0] || '').toLowerCase()
        let count = args[1] && args[1].length > 0 ? Math.min(9999999, Math.max(parseInt(args[1]), 1)) : Math.min(1)
        let who = m.mentionedJid ? m.mentionedJid[0] : (args[2].replace(/[@ .+-]/g, '').replace(' ', '') + '@s.whatsapp.net')
        if(!m.mentionedJid || !args[2]) throw 'Etiqueta a alguien del grupo!'
        let users = global.DATABASE._data.users
        switch (type) {
            case 'dinero':
                if (global.DATABASE._data.users[m.sender].money >= count * 1) {
                    try {
                        global.DATABASE._data.users[m.sender].money -= count * 1
                        global.DATABASE._data.users[who].money += count * 1
                        conn.reply(m.chat, `Se transfirió *${count}* de dinero`.trim(), m)
                    } catch (e) {
                        global.DATABASE._data.users[m.sender].money += count * 1
                        m.reply('Error de transferencia')
                        console.log(e)
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.sendMessage(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
                            }
                        }
                    }
                } else conn.reply(m.chat, `No tienes suficiente dinero para transferir`.trim(), m)
                break
            case 'pocion':
                if (global.DATABASE._data.users[m.sender].potion >= count * 1) {
                    try {
                        global.DATABASE._data.users[m.sender].potion -= count * 1
                        global.DATABASE._data.users[who].potion += count * 1
                        conn.reply(m.chat, `Se transfirió *${count}* de pocion`.trim(), m)
                    } catch (e) {
                        global.DATABASE._data.users[m.sender].potion += count * 1
                        m.reply('Error de transferencia')
                        console.log(e)
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.sendMessage(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
                            }
                        }
                    }
                } else conn.reply(m.chat, `No tienes suficientes pociones para transferir`.trim(), m)
                break
            case 'basura':
                if (global.DATABASE._data.users[m.sender].sampah >= count * 1) {
                    try {
                        global.DATABASE._data.users[m.sender].sampah -= count * 1
                        global.DATABASE._data.users[who].sampah += count * 1
                        conn.reply(m.chat, `Se transfirió *${count}* de basura`.trim(), m)
                    } catch (e) {
                        global.DATABASE._data.users[m.sender].sampah += count * 1
                        m.reply('Error de transferencia')
                        console.log(e)
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.sendMessage(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
                            }
                        }
                    }
                } else conn.reply(m.chat, `No tienes suficiente basura para transferir`.trim(), m)
                break
            case 'diamante':
                if (global.DATABASE._data.users[m.sender].diamond >= count * 1) {
                    try {
                        global.DATABASE._data.users[m.sender].diamond -= count * 1
                        global.DATABASE._data.users[who].diamond += count * 1
                        conn.reply(m.chat, `Se transfirió *${count}* de diamante`.trim(), m)
                    } catch (e) {
                        global.DATABASE._data.users[m.sender].diamond += count * 1
                        m.reply('Error de transferencia')
                        console.log(e)
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.sendMessage(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
                            }
                        }
                    }
                } else conn.reply(m.chat, `No tienes suficientes diamantes para transferir`.trim(), m)
                break
            case 'comun':
                if (global.DATABASE._data.users[m.sender].common >= count * 1) {
                    try {
                        global.DATABASE._data.users[m.sender].common -= count * 1
                        global.DATABASE._data.users[who].common += count * 1
                        conn.reply(m.chat, `Se transfirió *${count}* Cajas comunes`.trim(), m)
                    } catch (e) {
                        global.DATABASE._data.users[m.sender].common += count * 1
                        m.reply('Error de transferencia')
                        console.log(e)
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.sendMessage(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
                            }
                        }
                    }
                } else conn.reply(m.chat, `No tienes suficientes cajas comunes para transferir`.trim(), m)
                break
            case 'normal':
                if (global.DATABASE._data.users[m.sender].uncommon >= count * 1) {
                    try {
                        global.DATABASE._data.users[m.sender].uncommon -= count * 1
                        global.DATABASE._data.users[who].uncommon += count * 1
                        conn.reply(m.chat, `Se transfirió *${count}* Cajas normales`.trim(), m)
                    } catch (e) {
                        global.DATABASE._data.users[m.sender].uncommon += count * 1
                        m.reply('Error de transferencia')
                        console.log(e)
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.sendMessage(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
                            }
                        }
                    }
                } else conn.reply(m.chat, `No tienes suficientes cajas normales para transferir`.trim(), m)
                break
            case 'mitico':
                if (global.DATABASE._data.users[m.sender].mythic >= count * 1) {
                    try {
                        global.DATABASE._data.users[m.sender].mythic -= count * 1
                        global.DATABASE._data.users[who].mythic += count * 1
                        conn.reply(m.chat, `Se transfirió *${count}* Cajas miticas`.trim(), m)
                    } catch (e) {
                        global.DATABASE._data.users[m.sender].mythic += count * 1
                        m.reply('Error de transferencia')
                        console.log(e)
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.sendMessage(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
                            }
                        }
                    }
                } else conn.reply(m.chat, `No tienes suficientes cajas miticas para transferir`.trim(), m)
                break
            case 'legendario':
                if (global.DATABASE._data.users[m.sender].legendary >= count * 1) {
                    try {
                        global.DATABASE._data.users[m.sender].legendary -= count * 1
                        global.DATABASE._data.users[who].legendary += count * 1
                        conn.reply(m.chat, `Se transfirió *${count}* Cajas legendarias`.trim(), m)
                    } catch (e) {
                        global.DATABASE._data.users[m.sender].legendary += count * 1
                        m.reply('Error de transferencia')
                        console.log(e)
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.sendMessage(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
                            }
                        }
                    }
                } else conn.reply(m.chat, `No tienes suficientes cajas legendarias para transferir`.trim(), m)
                break
            default:
                return conn.reply(m.chat, `*El formato que estás usando es incorrecto*\n• ${usedPrefix + command} <tipo> <@tag>\n\n- Ejemplo: ${usedPrefix + command} dinero 100 @tag\n\n*Lista de transferencias:*\n\n- Dinero\n- Diamante\n- Pocion\n- Basura\n- Comun\n- Normal\n- Mitico\n- Legendario`.trim(), m)
        }
    } catch (e) {
        conn.reply(m.chat, `*El formato que estás usando es incorrecto*\n• ${usedPrefix + command} <tipo> <@tag>\n\n- Ejemplo: ${usedPrefix + command} dinero 100 @tag\n\n*Lista de transferencias:*\n\n- Dinero\n- Diamante\n- Pocion\n- Basura\n- Comun\n- Normal\n- Mitico\n- Legendario`.trim(), m)
        console.log(e)
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.sendMessage(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
            }
        }
    }
}
    
handler.help = ['transferir']
handler.tags = ['rpg']
handler.command = /^(transfer|transferir)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.money = 0

module.exports = handler
