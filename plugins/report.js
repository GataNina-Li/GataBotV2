const { MessageType } = require('@adiwajshing/baileys')

let handler = async(m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '*_Ingrese un reporte_*\n\n*_Ejemplo:_*\n*_#report El comando #owner tiene fallos, no manda el numero del creador_*', m)
    if (text > 300) return conn.reply(m.chat, 'Lo siento, el texto es demasiado largo, máximo 300 caracteres', m)
    var nomor = m.sender
    const teks1 = `*_❒═════[REPORTE]═════╾❒_*\n*_┬_*\n*_├Numero: wa.me/${nomor.split("@s.whatsapp.net")[0]}_*\n*_┴_*\n*_┬_*\n*_├Mensaje: ${text}_*\n*_┴_*`
    conn.sendMessage('593968585383@s.whatsapp.net', teks1, MessageType.text)
    //conn.sendMessage('xxxxxxxxxxxx@s.whatsapp.net', teks1, MessageType.text) // añade tu número aqui, pero no quites el otro. Quita las // del inicio de esta línea
    conn.reply(m.chat, '*_✅ El problema se ha informado al propietario/a del Bot ✅_*\n\n*_Nos pondremos en contacto contigo a la brevedad posible️_*', m)
}
handler.help = ['bug <reporte>', 'report <reporte>']
handler.tags = ['info']
handler.command = /^(bug|report|reporte)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
