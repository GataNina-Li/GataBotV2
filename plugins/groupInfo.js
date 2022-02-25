let handler = async (m, { conn, participants, groupMetadata }) => {

    const getGroupAdmins = (participants) => {
        admins = []
        for (let i of participants) {
            i.isAdmin ? admins.push(i.jid) : ''
        }
        return admins
    }

    let pp = './src/wa.jpg'
    try {
        pp = await conn.getProfilePicture(m.chat)
    } catch (e) {
    } finally {
        let { isBanned, welcome, antivirtex, detect, sWelcome, sBye, sPromote, sDemote, antiLink } = global.DATABASE.data.chats[m.chat]
        const groupAdmins = getGroupAdmins(participants)
        let listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.split('@')[0]}`).join('\n')
        let text = `*「 🔱 INFORMACIÓN DEL GRUPO 🔱 」*\n
🛅 *ID De Registro En El Bot:* 
${groupMetadata.id}

❇️ *Nombre:* 
${groupMetadata.subject}

✳️ *Descripcion:* 
${groupMetadata.desc}

👑 *Creador/a Del Grupo:* 
@${m.chat.split`-`[0]}

🏆 *Admins Del Grupo:*
${listAdmin}

👥 *Total De Participantes:*
${participants.length} Participantes

⚙ *Configuraciones Del Grupo:*
${welcome ? '✅' : '❌'} Welcome
${global.DATABASE.data.chats[m.chat].delete ? '❌' : '✅'} Anti Delete
${antiLink ? '✅' : '❌'} Anti Link
`.trim()
        ownernya = [`${m.chat.split`-`[0]}@s.whatsapp.net`]
        let mentionedJid = groupAdmins.concat(ownernya)
        conn.sendFile(m.key.remoteJid, pp, 'pp.jpg', text, m, false, { contextInfo: { mentionedJid } })
    }
}
handler.help = ['infogrup']
handler.tags = ['group']
handler.command = /^(infogroup|gc|infogrupo)$/i

handler.group = true

module.exports = handler
