const { ephoto } = require('../lib/ephoto.js')


let handler = async(m, { conn, args, usedPrefix, text,command}) => {
let oi = './src/gl.jpg'
    if (args.length == 0) return conn.sendFile(m.chat, oi, 'p.jpg',`*_Para utilizar esta función_*\n_- Escribe: #galaxia (codigo) (tu texto)_\n\n*_Ejemplo: #galaxia b Solo se vive una vez_* \n\n*_Codigos/letras disponibles:_*\n_- a_ \n_- b_\n_- c_ \n_- d_ \n_- e_ \n_- f_\n\n*Nota: No escribas los* * *ni los _*`, m, false, {thumbnail: Buffer.alloc[0]})
let Pilihan = args[0]
let uuid = {
 a: "0333f7bc-b275-43da-ab34-b6bd550bc9f7",
 b: "adc92b8e-1bc7-46b1-9f24-69054a5b59d3",
 c: "7a951e7b-7881-4abe-ad1d-b1d4a81fc67a",
 d: "577522b2-7047-448c-8306-7f441cb744d4",
 e: "a074b12c-409a-428f-8349-2f02eac01587",
 f: "1a65b9cc-cd6b-4730-b763-0d9196e35725"
 
}[Pilihan]
if (!uuid) throw `*_✳️ Lo sentimos, el código/letra introducido no es correcto_*\n\n*_✅ Escriba ${usedPrefix+command} para ver la lista de códigos/letras disponibles_*`
let [teks1, ...teks2] = text.replace(Pilihan,'').trimStart().split('|')
if (!teks1) throw `❗Ingrese un texto\nEjemplo: ${usedPrefix+command} a Bruno Sobrino`
  if(teks1.length > 23) throw `*🔰 Uhm.. el texto es demasiado largo.. ingrese um texto mas corto*`
teks2 = teks2.join('|')
  let result = await ephoto('https://ephoto360.com/tao-hinh-nen-dien-thoai-galaxy-theo-ten-dep-full-hd-684.html', `${teks1}`, uuid)
    let uh = `https://s1.ephoto360.com${result.image}`
await conn.sendFile(m.chat, uh,'error.jpg', '*_"Disfruta de cada momento"_*', m,false, { thumbnail: Buffer.alloc(0) })
    
  }
handler.help = ['galaxy <Teks>']
handler.tags = ['ep'] 
handler.command = /^galaxia$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.limit = false
handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler