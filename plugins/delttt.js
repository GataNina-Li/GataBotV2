let handler = async (m, { conn, text }) => {
	conn.game = conn.game ? conn.game : {}
	try {
		if (conn.game) {
			delete conn.game
			conn.reply(m.chat, `✅ *Se elimino correctamente la sala*`, m)
		} else if (conn.game) {
			m.reply(`*La sala no existe* 🤷‍♀\n\n*Corrobore haber puesto bien la sala*`)
		} else throw '?'
	} catch (e) {
		m.reply('estropeado')
	}
}
handler.help = ['delsesittt']
handler.tags = ['game']
handler.command = /^(delsesittt|dellsesitt|delttt|deltictactoe)$/i
handler.limit = false

handler.register = false
handler.fail = null

module.exports = handler
