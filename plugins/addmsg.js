let handler = async (m, { command, usedPrefix, text }) => {
    let M = m.constructor
    let which = command.replace(/agregar/i, '')
    if (!m.quoted) throw '*Responde a algo y añade un texto*!'
    if (!text) throw `Utilizar *${usedPrefix}list${which}* para ver la lista`
    let msgs = global.DATABASE._data.msgs
    if (text in msgs) throw `'${text}' se ha registrado en la lista de mensajes`
    msgs[text] = M.toObject(await m.getQuotedObj())
    m.reply(`*✳️ Mensaje agregado exitosamente en la lista de mensajes como '${text}'*
    
*Accede con ${usedPrefix}ver${which} ${text}*`)
}
handler.help = ['vn', 'msg', 'video', 'audio', 'img', 'sticker'].map(v => 'add' + v + ' <text>') 
handler.tags = ['database']
handler.command = /^agregar(vn|msg|video|audio|img|sticker)$/
handler.group = true

module.exports = handler
