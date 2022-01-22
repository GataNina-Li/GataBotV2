let handler = async (m, { conn, text, isROwner, isOwner }) => {
  if (text) {
    if (isROwner) global.conn.bye = text
    else if (isOwner) conn.bye = text
    else global.DATABASE._data.chats.sBye = text
    m.reply('Despedida configurada correctamente\n Use @user para mencionar al usuario')
  } else throw 'Teksnya mana?'
}
handler.help = ['setbye <teks>']
handler.tags = ['owner', 'group']
handler.rowner = true

handler.command = /^setbye$/i
module.exports = handler