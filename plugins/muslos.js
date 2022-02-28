let fetch = require('node-fetch')

let handler = async (m, { conn }) => {
	let url = muslos[Math.floor(Math.random() * muslos.length)]
	await conn.sendMessage(m.chat, {
		contentText: '❤️‍🔥❤️‍🔥❤️‍🔥',
		footerText: 'Gata Dios',
		buttons: [
			{ buttonId: '.muslos', buttonText: { displayText: 'SIGUIENTE 🔄' }, type: 1 }
		],
		headerType: 4,
		imageMessage: (await conn.prepareMessageMedia(await (await fetch(url)).buffer(), 'imageMessage', {})).imageMessage
	}, 'buttonsMessage', { quoted: m })
}
handler.command = /^(muslos)$/i
handler.tags = ['internet']
handler.help = ['muslos']
module.exports = handler

global.muslos = [
"https://i.imgur.com/uGzFdVD.jpg",
"https://i.imgur.com/XLNHZDB.jpg",
"https://i.imgur.com/97wc7tf.jpg",
"https://i.imgur.com/xUS74sl.jpg",
"https://i.imgur.com/T3J0a0V.jpg",
"https://i.imgur.com/ZXGstbh.jpg",
"https://i.imgur.com/tFnHUzu.jpg",
"https://i.imgur.com/bLuKAkv.jpg",
"https://i.imgur.com/KqwqwWT.jpg",
"https://i.imgur.com/HNRFA2d.jpg",
"https://i.imgur.com/maj2vCy.jpg",
"https://i.imgur.com/Wtka9lQ.jpg",
"https://i.imgur.com/iPxVsRN.jpg",
"https://i.imgur.com/CGxMkwR.jpg",
"https://i.imgur.com/Vcv90HQ.jpg",
"https://i.imgur.com/N0kcxJh.jpg",
"https://i.imgur.com/opFmmKu.jpg",
"https://i.imgur.com/lVe9ay0.jpg",
"https://i.imgur.com/nfTWjuE.jpg",
"https://i.imgur.com/ojCMG7G.jpg",
"https://i.imgur.com/KoV3pwz.jpg",
"https://i.imgur.com/M8MnbCE.jpg",
"https://i.imgur.com/RVGS8Bc.jpg",
"https://i.imgur.com/kV063RZ.jpg",
"https://i.imgur.com/xYQZ73z.jpg",
"https://i.imgur.com/TzG2ozI.jpg",
"https://i.imgur.com/d957bf9.jpg",
"https://i.imgur.com/Sz7O8Na.jpg",
"https://i.imgur.com/ots1C4k.jpg",
"https://i.imgur.com/6LoLi5T.jpg",
"https://i.imgur.com/vMdbESU.jpg",
"https://i.imgur.com/0wTQqWo.jpg",
"https://i.imgur.com/h5Uzg3B.jpg",
"https://i.imgur.com/hD2ZDaL.jpg",
"https://i.imgur.com/xQdMTML.jpg",
"https://i.imgur.com/0l5nTKw.jpg",
"https://i.imgur.com/55SqTTm.jpg",
"https://i.imgur.com/SIqr2Ju.jpg",
"https://i.imgur.com/YxAw706.jpg",	
"https://i.imgur.com/rssXY6l.jpg",
"https://i.imgur.com/sh9KrZP.jpg",	
"https://i.imgur.com/RJFX4Md.jpg",
"https://i.imgur.com/eDZ1qIC.jpg"	
]
