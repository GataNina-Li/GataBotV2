const cooldowns = {
    lastadventure: {
        name: 'adventure',
        cooldown: require('./adventure').cooldown
    },
    lastclaim: {
        name: 'claim',
        cooldown: require('./daily').cooldown
    },
    lastweekly: {
        name: 'weekly',
        cooldown: require('./weekly').cooldown
    },
    lastmonthly: {
        name: 'monthly',
        cooldown: require('./monthly').cooldown
    }
}
let handler = async (m, { conn, usedPrefix }) => {
    const user = global.DATABASE._data.users[m.sender]
    let str = `\t\t*‧ 🕰️ Tiempo de Espera 🕰️ ‧*\n\n${Object.entries(cooldowns).map(([d, { name, cooldown }]) => `*${name}:* ${new Date() - user[d] >= cooldown ? '✅' : '❌'}`).join('\n')}`
    conn.sendButton(m.chat, str, `*©Cᴏᴍᴘᴀɴʏ Zᴇɴ Bᴏᴛ*`, null, [
        ['Inventario 🎒', usedPrefix + 'inv'],
        ['Perfil 👤', usedPrefix + 'profile']
    ], { quoted: m })
}
handler.help = ['cd', 'cooldown']
handler.tags = ['rpg']
handler.command = /^(cd|cooldown)$/i
module.exports = handler
