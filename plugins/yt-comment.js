let handler = async (m, { conn, text }) => {
  if (!text) throw '❰ ❗️ ❱ *Estas usando mal el comando!!*\n*Ejemplo:* *#ytcomentar* Gata Dios'
  conn.sendFile(m.chat, global.API('https://some-random-api.ml', '/canvas/youtube-comment', {
    avatar: await conn.getProfilePicture(m.sender).catch(_ => ''),
    comment: text,
    username: conn.getName(m.sender)
  }), 'yt-comment.png', '*¡Haz comentado en YouTube!* 😳', m)
}

handler.help = ['ytcomment <comment>']
handler.tags = ['maker']

handler.command = /^ytcomentario|ytcomentar$/i

module.exports = handler
