let handler = async (m, { conn, command, usedPrefix, text }) => {
    let which = command.replace(/ver/i, '')
    if (!text) throw `*✳️ Usar *${usedPrefix}list${which}* para ver la lista*`
    let msgs = global.DATABASE._data.msgs
    if (!text in msgs) throw `*'❗${text}' no registrado en la lista de mensajes*`
    let _m = await conn.serializeM(msgs[text])
    await _m.copyNForward(m.chat, true)
}
handler.help = ['vn', 'msg', 'video', 'audio', 'img', 'sticker'].map(v => 'get' + v + ' <text>')
handler.tags = ['database']
handler.command = /^ver(vn|msg|video|audio|img|sticker)$/
handler.rowner = true

module.exports = handler
