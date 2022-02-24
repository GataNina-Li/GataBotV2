let { MessageType } = require('@adiwajshing/baileys')
let fetch = require('node-fetch')
let handler = async (m, { conn, args, usedPrefix, DevMode }) => {
    try {
        if (!args || !args[0] || args.length < 1) return m.reply('*[❗] Ingrese un texto*\n\n*Ejemplo:*\n#letra JuanSolo QueridoCorazon*')
        let res = await fetch(global.API('bg', '/lirik', { 
            title: args[0],
            artist: args[1] || '' 
        }))
        let json = await res.json()
        if (json.status !== true) throw json
        m.reply(`
*〘 ${args[0]} 〙*

*Letra:*
\`\`\`${json.result}\`\`\`
`.trim())
    } catch (e) {
        m.reply('*[ ⚠️ ] Error!*\n\n*[❗] Recuerda poner el título/nombre de la canción sin dejar espacio*\n*Ejemplo:*\n*#letra JuanSolo QueridoCorazón*')
        console.log(e)
        if (DevMode) {
            let file = require.resolve(__filename)
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.sendMessage(jid, file + ' error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
            }
        }
    }
}
    
handler.help = ['lirik', 'lyrics'].map(v => ' [title] [artist]')
handler.tags = ['internet']
handler.command = /^(l(irik|yrics)|letra)$/i

module.exports = handler
