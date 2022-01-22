const { ephoto } = require('../lib/ephoto.js')


let handler = async(m, { conn, args, usedPrefix, text, command}) => {

    if (args.length == 0) throw `*Uso correcto del comando*\n*${usedPrefix + command} (estilo) (texto)*\n\n*Ejemplo:* *${usedPrefix + command} style1 Shadow Gaming*\n\n*Estilos disponibles:*\n*style1, style2, style3, style4, style5, style6, style7, style8, style9, style10, style11, style12*`
let Pilihan = args[0]
let uuid = {
 style1: '0fbc11a6-dcbd-4968-8149-5b4e8a9aa507',
 style2: '9dce5d5c-2f6a-4007-b1fb-e6eac68b4833',
 style3: 'aec34158-b50c-49ff-b748-e33e0a47dffc',
 style4: 'a49243c5-8089-4d19-a595-50f1aa745849',
 style5: '337af54a-f78a-42c5-a3c1-39dbf9183aba',
 style6: '86e21396-f7cc-4d36-af19-ae8eac57234c',
 style7: '52b190df-5f73-466f-868f-ec0eb6cd6f36',
 style8: 'c870cd92-f262-42fb-94fa-2d35397bd871',
 style9: 'a451009c-ba22-4eb0-8939-5f0d3caafdaa',
 style10: '2632e3e7-e522-46b7-b907-5c0ce4d120bc',
 style11: 'febfc612-b069-4c79-b835-022c665b6f70',
 style12: '489f8005-5a51-430c-87aa-f2589564a29b',
 
}[Pilihan]
if (!uuid) throw `*Lo sentimos, el estilo no esta disponible*\n\n*Escriba ${usedPrefix + command} para ver la lista de estilos disponibles*`
let [teks1, ...teks2] = text.replace(Pilihan,'').trimStart().split('|')
if (!teks1) throw `*Ingrese un texto*\n\n*Ejemplo: ${usedPrefix+command} style2 Shadow Gaming*`
if(teks1.length > 13) throw `*Uhm.. el texto es demasiado largo, ingrese un texto menor a 12 caracteres*`
teks2 = teks2.join('|')
  let result = await ephoto('https://ephoto360.com/tao-logo-mascot-game-thu-nu-sieu-de-thuong-813.html', `${teks1}`, uuid)
    let uh = `https://s1.ephoto360.com${result.image}`
await conn.sendFile(m.chat, uh,'p.jpg', '*Aquí tienes tu logo*', m,false, { thumbnail: Buffer.alloc(0) })
    
  }

handler.help = ['gamergirl']
handler.tags = ['ep']
handler.command = /^gamergirl$/i
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0

module.exports = handler