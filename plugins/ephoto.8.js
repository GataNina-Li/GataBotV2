const { ephoto2 } = require('../lib/ephoto2.js')


let handler = async(m, { conn, args, usedPrefix, text}) => {
  if (!text) throw '*Ingrese un texto*\n\n*Ejemplo:*\n*#starlogo The Shadow Brokers*'
  if (text.length > 30) throw '*Uhm... texto largo, ingrese un texto menor a 30 caracteres*'
  let result = await ephoto2('https://ephoto360.com/hieu-ung-chu/tao-chu-ngoi-sao-kim-loai-109.html',`${text}`)
    let uh = `https://s1.ephoto360.com${result.image}`
await conn.sendFile(m.chat, uh,'p.jpg', '*Ahora eres todo una estrella*', m,false, { thumbnail: Buffer.alloc(0) })
/*await conn.sendFile(m.chat, uh, 'p.jpg', 'wuis',m)*/
    
  }

handler.help = ['starlogo']
handler.tags = ['ep']
handler.command = /^starlogo$/i
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler