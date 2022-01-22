let handler = async (m, { conn }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  conn.sendFile(m.chat, global.API('https://some-random-api.ml', '/canvas/gay', {
    avatar: await conn.getProfilePicture(who).catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
  }), 'gay.png', '*_Miren a este gay 🏳️‍🌈_*', m)
conn.sendFile(m.chat, 'media/cancion2.mp3', '', 'xd', m)
}

handler.help = ['gay2']
handler.tags = ['General']

handler.command = /^(gay2)$/i

module.exports = handler