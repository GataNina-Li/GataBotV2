const { ephoto3 } = require('../lib/ephoto3.js')


let handler = async(m, { conn, args, usedPrefix, text, command}) => {

    if (args.length == 0) throw `*Uso correcto del comando:*\n*${usedPrefix+command} (tipo) (texto)*\n\n*Ejemplo:*\n*${usedPrefix+command} type1 GataBot*\n\n*Tipos disponibles:*\ntype1\ntype2`
let Pilihan = args[0]
let uuid = {
 type1: 'https://en.ephoto360.com/create-a-blackpink-neon-logo-text-effect-online-710.html',
 type2: 'https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html'
 
}[Pilihan]
if (!uuid) throw `*Tipo incorrecto*\n\n*Tipos disponibles:*\ntype1\ntype2\n\n*Ejemplo:*\n*#lblackpink type1 GataBot*`
let [teks1, ...teks2] = text.replace(Pilihan,'').trimStart().split('|')
if(!teks1) throw '✨ *Ingrese un texto*\n\n✨ *Ejemplo:*\n*#lblackpink type1 GataBot*'
if(teks1.length > 20) throw `*Uhm.. texto demasiado largo, ingrese un texto menor a 20 caracteres*\n\n*Ejemplo:*\n${usedPrefix+command} type1 GataBot*`
teks2 = teks2.join('|')
  let result = await ephoto3(uuid, `${teks1}`)
    let uh = `https://s1.ephoto360.com${result.image}`
await conn.sendFile(m.chat, uh,'p.jpg', '*“En lugar de conversaciones enérgicas con otros, prefiero estar en incómodo silencio contigo”*\n\n*“Rather than forceful conversations with others, I’d rather be in awkward silence with you”*\n\n*“사람들과의 억지스런 한마디보단 너와의 어색한 침묵이 차라리 좋아”*', m,false, { thumbnail: Buffer.alloc(0) })
    
  }

handler.help = ['blackpink [theme] [teksnya]']
handler.tags = ['ep']
handler.command = /^lblackpink$/i
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
