let handler = async (m, { conn, text }) => {
  let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
  conn.sendFile(m.chat, global.API('xteam', '/attp', { file: '', text: teks }), 'attp.webp', '', m, false, { asSticker: true })
//conn.reply(m.chat, `
//*_EL SERVIDOR DONDE SE CREA LOS STICKERS ESTA CON FALLAS Y AVECES SOLO MANDA UN STICKER SIN NADA, ESTE ERROR NO TIENE SOLUCIÓN PRONTA QUE YO LE PUEDA DAR YA QUE NO TENO ACCESO A ESE SERVIDOR. AHORA SI QUE ES CUESTION DE SUERTE CUANDO FUNCIONE, LOS COMANDOS #attp2, #ttp2, #ttp4, #ttp5, #ttp6 y #ttpdark SIGUEN FUNCIONANDO CON NORMALIDAD_*
//`.trim(), m)  
}
handler.help = ['attp <teks>']
handler.tags = ['sticker']

handler.command = /^attp$/i

module.exports = handler
