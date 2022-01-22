let handler = function (m) {
  if (!m.quoted) throw false
  let { chat, fromMe, id, isBaileys } = m.quoted
  if (!fromMe) throw false
  if (!isBaileys) throw 'El mensaje no fue enviado por el bot!'
  this.deleteMessage(chat, {
    fromMe,
    id,
    remoteJid: chat
  })
}
handler.help = ['eliminar']
handler.tags = ['info']

handler.command = /^del(ete)?$/i

module.exports = handler
