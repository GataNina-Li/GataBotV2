let handler = async (m, { conn }) => {
  let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  conn.sendFile(m.chat, global.API('https://some-random-api.ml', '/canvas/lolice', {
    avatar: await conn.getProfilePicture(who).catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
  }), 'lolice.png', '💢 *Lolicons como tú solo pertenecen a la cárcel* 💢\n🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈', m)
}

handler.help = ['lolice']
handler.tags = ['maker']

handler.command = /^(lolice)$/i

module.exports = handler
