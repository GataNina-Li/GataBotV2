let handler = async (m, { conn, text }) => {
  if (!text) throw 'Y el texto?'
  conn.sendFile(m.chat, global.API('https://some-random-api.ml', '/canvas/youtube-comment', {
    avatar: await conn.getProfilePicture(m.sender).catch(_ => ''),
    comment: text,
    username: conn.getName(m.sender)
  }), 'yt-comment.png', 'Aqui esta tu comentario', m)
}

handler.help = ['ytcomment <comment>']
handler.tags = ['General']

handler.command = /^(ytcomment)$/i

module.exports = handler
