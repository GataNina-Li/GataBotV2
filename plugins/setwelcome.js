let handler = async (m, { conn, text }) => {
  if (text) {
    conn.welcome = text
    m.reply('Bienvenida configurada correctamente\n Use @user para mencionar al usuario')
  } else throw 'Y el texto?'
}
handler.help = ['setwelcome <teks>']
handler.tags = ['owner']
handler.rowner = true

handler.command = /^setwelcome$/i 
module.exports = handler

