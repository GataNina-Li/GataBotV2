let fetch = require('node-fetch')

let handler = async (m, { conn }) => {
	let url = packgirl[Math.floor(Math.random() * packgirl.length)]
	await conn.sendMessage(m.chat, {
		contentText: '*Pack xxx By TheBrokers*',
		footerText: 'Gata Dios',
		buttons: [
			{ buttonId: '.pack2', buttonText: { displayText: 'SIGUIENTE 🔄' }, type: 1 }
		],
		headerType: 4,
		imageMessage: (await conn.prepareMessageMedia(await (await fetch(url)).buffer(), 'imageMessage', {})).imageMessage
	}, 'buttonsMessage', { quoted: m })
}
handler.command = /^(pack2)$/i
handler.tags = ['internet']
handler.help = ['pack']
module.exports = handler

global.packgirl = [
  "https://i.imgur.com/mwLJaxU.jpg",
  "https://i.imgur.com/9ptmlPl.jpg",
  "https://i.imgur.com/38tVliz.jpg",
  "https://i.imgur.com/2NqCKE3.jpg",
  "https://i.imgur.com/pveviMG.jpg",
  "https://i.imgur.com/d71dnkv.jpg",
  "https://i.imgur.com/cr7Ypj1.jpg",
  "https://i.imgur.com/jAxzCj4.jpg",
  "https://i.imgur.com/xokuFLf.jpg",
  "https://i.imgur.com/Hi4zLaf.jpg",
  "https://i.imgur.com/OlaQtwW.jpg",
  "https://i.imgur.com/Dm4GLuF.jpg",
  "https://i.imgur.com/k6Y2E9b.jpg",
  "https://i.imgur.com/1rk7jdu.jpg",
  "https://i.imgur.com/TFmEVPc.jpg",
  "https://i.imgur.com/0XefLlJ.jpg",
  "https://i.imgur.com/bwa9LYZ.jpg",
  "https://i.imgur.com/WgrpTmg.jpg",
  "https://i.imgur.com/Z5f5YAw.jpg",
  "https://i.imgur.com/xEuBtPO.jpg",
  "https://i.imgur.com/NA0fHxn.jpg",
  "https://i.imgur.com/InueCKQ.jpg",
  "https://i.imgur.com/3syOcHe.jpg",
  "https://i.imgur.com/N1dgels.jpg",
  "https://i.imgur.com/IxKAJaV.jpg",
  "https://i.imgur.com/8VrxL1d.jpg",
  "https://i.imgur.com/8B4Y0bG.jpg",
  "https://i.imgur.com/wgkGOjF.jpg",
  "https://i.imgur.com/765Wi6q.jpg",
  "https://i.imgur.com/5joeWnm.jpg",
  "https://i.imgur.com/71fjmmM.jpg",
  "https://i.imgur.com/cAuKeyZ.jpg",
  "https://i.imgur.com/SDZ2Hs5.jpg",
  "https://i.imgur.com/skkEyqI.jpg",
  "https://i.imgur.com/6dXFsBW.jpg",
  "https://i.imgur.com/6CeG9ZX.jpg"
]
