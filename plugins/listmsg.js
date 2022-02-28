let handler = m => {
    let msgs = global.DATABASE._data.msgs
    m.reply(`
*🔰 LISTA DE TEXTOS/MENSAJES/PALABRAS CLAVES 🔰*

*✳️ MENSAJES ✳️*
${Object.keys(msgs).map(v => '*👉 ' + v).join('\n')}*
`.trim())
}
handler.help = ['vn', 'msg', 'video', 'audio', 'img', 'sticker'].map(v => 'list' + v)
handler.tags = ['database']
handler.command = /^lista(vn|msg|video|audio|img|sticker)$/

module.exports = handler
