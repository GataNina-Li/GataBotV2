const { ephoto3 } = require('../lib/ephoto3.js')


let handler = async(m, { conn, args, usedPrefix, text}) => {

  if (!text) throw '*Y el texto..?*\n*Ingrese un texto*\n\n*Ejemplo:*\n*#logocorazon T y S*\n\n*Nota: El texto no puede ser mayor a 15 letras*'
  if (text.length > 15) throw '*Uhm.. texto demasiado largo, ingrese un texto menor a 15 caracteres*'
  let result = await ephoto3('https://en.ephoto360.com/text-heart-flashlight-188.html', `${text}`)
    let uh = `https://s1.ephoto360.com${result.image}`
await conn.sendFile(m.chat, uh,'p.jpg', '*El amor es lo mejor del mundo*', m,false, { thumbnail: Buffer.alloc(0) })
    
  }

handler.help = ['flashlight']
handler.tags = ['ep']
handler.command = /^logocorazon|logocorazón|logoheart$/i
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
