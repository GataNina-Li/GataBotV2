const { ephoto } = require('../lib/ephoto.js')
let handler = async (m, { conn, args, usedPrefix, command}) => {
    let a = args.join` `
  
    	  if (!a) throw '*Ingrese un texto*\n\n*Ejemplo: #freefire The Shadow Brokers*'
if(a.length > 22) throw `*Uhm.. el texto es demasiado largo*\n\n*Ingrese un texto menor a 21 caracteres* `
let pe = ["18e72a21-196c-490e-af1d-602c21db2aad","128c11e9-903a-46c8-920f-545e8c5dcf44","445f0132-5cf0-4e14-9b82-d85eea600b3d","beb962fc-3aaf-4278-8a11-8668f2a60f32","8738b5a3-aaaa-4c79-9545-49e91e467194","5e1ee0f4-0a7c-4908-82ce-f86d9d10b5d9","1f618436-252b-4561-b3f0-4d209ec0e1a2","0b51633b-fb98-4cb0-be89-b5d4dc86424a","1a43cd83-a813-4efb-9497-5abe02641852","2ce442d8-01a7-4f91-af87-48622c8f3cdf","86cbfb1a-ce7f-4251-8583-1281f8e614a0","d0827921-343e-4dd3-92cc-c7cb0fcda71f","46aa36c3-f354-4dd3-bb16-34e4f08bbe78","540e9950-0cda-4114-88ce-7ce23162057d","3f9cd69d-9d49-4f7b-ab77-8e99e7aeb607","0e34987b-a7d2-4132-837a-b154dfd2cd78","f6747b1e-d161-4324-aeff-5f0e3526c389","ccafb56b-93a0-424b-9269-6dc2841731a1","a2e51371-3ac2-461f-a6c0-2ed2f924ec31","da46988b-dcf4-4044-95c8-a8beaa4a5d44","567b5afb-499f-4b01-a230-3b53c5b802a7","043a00d7-a84e-4504-8087-4c41bcdb0ef0"]
let cewe = pe[Math.floor(Math.random() * pe.length)]
  ephoto('https://ephoto360.com/tao-anh-bia-cover-game-free-fire-voi-ten-cua-ban-644.html',`${a}`, `${cewe}`).then(result => {
    let uh = `https://s1.ephoto360.com${result.image}`
conn.sendFile(m.chat, uh,'p.jpg','*Aquí tienes tu logo*', m,false, { thumbnail: Buffer.alloc(0) })
  }).catch(err => {
    console.log(err)
    conn.reply(m.chat, 'error',m)
  })
}
handler.help = ['freefire [text]']
handler.tags = ['ep']
handler.command = /^freefire$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botAdmin = false
handler.fail = null
handler.limit = false
module.exports = handler