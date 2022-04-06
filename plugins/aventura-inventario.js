let { MessageType, mentionedJid } = require("@adiwajshing/baileys")
let fs = require('fs')
let levelling = require('../lib/levelling')
let handler = async (m, { conn, text, usedPrefix, command }) => {
    let healt = global.DATABASE._data.users[m.sender].healt
    
    var _healt = '🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍'
       if (healt <= 10) {
        _healt = '❤🤍🤍🤍🤍🤍🤍🤍🤍🤍'
} else if (healt <= 20) {
        _healt = '❤❤🤍🤍🤍🤍🤍🤍🤍🤍'
} else if (healt <= 30) {
        _healt = '❤❤❤🤍🤍🤍🤍🤍🤍🤍'
} else if (healt <= 40) {
	_healt = '❤❤❤❤🤍🤍🤍🤍🤍🤍'
} else if (healt <= 50) {
	_healt = '❤❤❤❤❤🤍🤍🤍🤍🤍'
} else if (healt <= 60) {
	_healt = '❤❤❤❤❤❤🤍🤍🤍🤍'
} else if (healt <= 70) {
	_healt = '❤❤❤❤❤❤❤🤍🤍🤍'
} else if (healt <= 80) {
	_healt = '❤❤❤❤❤❤❤❤🤍🤍'
} else if (healt <= 90) {
	_healt = '❤❤❤❤❤❤❤❤❤🤍'
} else if (healt <= 999999999) {
	_healt = '❤❤❤❤❤❤❤❤❤❤'
}

    let armor = global.DATABASE._data.users[m.sender].armor
    let pickaxe = global.DATABASE._data.users[m.sender].pickaxe
    let pdurability = global.DATABASE._data.users[m.sender].pickaxedurability
    
    let warn = global.DATABASE._data.users[m.sender].warn
    let pet = global.DATABASE._data.users[m.sender].pet
    let kucing = global.DATABASE._data.users[m.sender].kucing
    let _kucing = global.DATABASE._data.users[m.sender].anakkucing
    let rubah = global.DATABASE._data.users[m.sender].rubah
    let _rubah = global.DATABASE._data.users[m.sender].anakrubah
    let kuda = global.DATABASE._data.users[m.sender].kuda
    let _kuda = global.DATABASE._data.users[m.sender].anakkuda
    
    let diamond = global.DATABASE._data.users[m.sender].diamond
    let batu = global.DATABASE._data.users[m.sender].batu
    let iron = global.DATABASE._data.users[m.sender].iron
    
    let potion = global.DATABASE._data.users[m.sender].potion
    let common = global.DATABASE._data.users[m.sender].common
    let makananpet = global.DATABASE._data.users[m.sender].makananpet
    let uncommon = global.DATABASE._data.users[m.sender].uncommon
    let mythic = global.DATABASE._data.users[m.sender].mythic
    let legendary = global.DATABASE._data.users[m.sender].legendary
    let level = global.DATABASE._data.users[m.sender].level
    let money = global.DATABASE._data.users[m.sender].money
    let exp = global.DATABASE._data.users[m.sender].exp
    let sampah = global.DATABASE._data.users[m.sender].sampah
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let math = max - xp
    let name = m.fromMe ? conn.user : conn.contacts[m.sender]
    let sortedmoney = Object.entries(global.DATABASE.data.users).sort((a, b) => b[1].money - a[1].money)
    let sortedlevel = Object.entries(global.DATABASE.data.users).sort((a, b) => b[1].level - a[1].level)
    let sorteddiamond = Object.entries(global.DATABASE.data.users).sort((a, b) => b[1].diamond - a[1].diamond)
    let sortedpotion = Object.entries(global.DATABASE.data.users).sort((a, b) => b[1].potion - a[1].potion)
    let sortedsampah = Object.entries(global.DATABASE.data.users).sort((a, b) => b[1].sampah - a[1].sampah)
    let sortedcommon = Object.entries(global.DATABASE.data.users).sort((a, b) => b[1].common - a[1].common)
    let sorteduncommon = Object.entries(global.DATABASE.data.users).sort((a, b) => b[1].uncommon - a[1].uncommon)
    let sortedmythic = Object.entries(global.DATABASE.data.users).sort((a, b) => b[1].mythic - a[1].mythic)
    let sortedlegendary = Object.entries(global.DATABASE.data.users).sort((a, b) => b[1].legendary - a[1].legendary)
    let usersmoney = sortedmoney.map(v => v[0])
    let usersdiamond = sorteddiamond.map(v => v[0])
    let userspotion = sortedpotion.map(v => v[0])
    let userssampah = sortedsampah.map(v => v[0])
    let userslevel = sortedlevel.map(v => v[0])
    let userscommon = sortedcommon.map(v => v[0])
    let usersuncommon = sorteduncommon.map(v => v[0])
    let usersmythic = sortedmythic.map(v => v[0])
    let userslegendary = sortedlegendary.map(v => v[0])
    let invt = fs.readFileSync('./src/image/inventario.png')
    let str = `
Inventario de @${m.sender.split("@s.whatsapp.net")[0]}

     *ESTADO*
*• ♥️ Vida:* ${healt}
*• 👕 Armadura:* ${armor == 0 ? 'No tiene' : '' || armor == 1 ? 'Armadura de cuero' : '' || armor == 2 ? 'Armadura de hierro' : '' || armor == 3 ? 'Armadura de oro' : '' || armor == 4 ? 'Armadura de diamante' : '' || armor == 5 ? 'Armadura de netherite' : ''}
*• ⛏️ Pico:* ${pickaxe == 0 ? 'No tiene' : '' || pickaxe == 1 ? 'Pico de piedra' : '' || pickaxe == 2 ? 'Pico de hierro' : '' || pickaxe == 3 ? 'Pico de oro' : '' || pickaxe == 4 ? 'Pico de diamante' : '' || pickaxe == 5 ? 'Pico de netherite' : ''}
*• ⛏️ Durabilidad:* ${pdurability}

*• 💵 Dinero:* ${money}
*• 📈 Nivel:* ${level}
*• ✨ Exp:* ${exp}

     *INVENTARIO*
*• 💎 Diamante:* ${diamond}
*• 🪨 Piedra:* ${batu}
*• 🔩 Hierro:* ${iron}
*• 🧪 Poción:* ${potion}
*• 🗑️ Basura:* ${sampah}
*• 🥫 Alimento:* ${makananpet}
*• 🎒 Total inv:* ${diamond + batu + iron + potion + sampah + makananpet} items

     *CAJAS*
*• 📦 Comun:* ${common}
*• 🛍️ Normal:* ${uncommon}
*• 🎁 Mitico:* ${mythic}
*• 🧰 Legendario:* ${legendary}
*• 📫 Mascota:* ${pet}

     *MASCOTAS*
*• 🦊 Zorro:* ${rubah == 0 ? 'No tiene' : '' || rubah == 1 ? 'Nivel 1' : '' || rubah == 2 ? 'Nivel 2' : '' || rubah == 3 ? 'Nivel 3' : '' || rubah == 4 ? 'Nivel 4' : '' || rubah == 5 ? 'Nivel maximo' : ''}
*• 🐺 Lobo:* ${kuda == 0 ? 'No tiene' : '' || kuda == 1 ? 'Nivel 1' : '' || kuda == 2 ? 'Nivel 2' : '' || kuda == 3 ? 'Nivel 3' : '' || kuda == 4 ? 'Nivel 4' : '' || kuda == 5 ? 'Nivel maximo' : ''}
*• 🐱 Gato:* ${kucing == 0 ? 'No tiene' : '' || kucing == 1 ? 'Nivel 1' : '' || kucing == 2 ? 'Nivel 2' : '' || kucing == 3 ? 'Nivel 3' : '' || kucing == 4 ? 'Nivel 4' : '' || kucing == 5 ? 'Nivel maximo' : ''}

     *PROGRESO*
╭──────────────
│👤 *Tu nivel* ${level} ➯ ${level + 1}
│Exp: ${exp} -> ${math <= 0 ? `\n│Use ${usedPrefix}levelup para subir de nivel!` : `${math}`}
╰──────────────
╭──────────────
│🦊 *Zorro* ${rubah == 0 ? 'No tiene' : '' || rubah > 0 && rubah < 5 ? `nivel ${rubah} ➯ ${rubah + 1}\n│Exp: ${_rubah} -> ${rubah * 100}` : '' || rubah == 5 ? 'Nivel maximo' : ''}
╰──────────────
╭──────────────
│🐺 *Lobo* ${kuda == 0 ? 'No tiene' : '' || kuda > 0 && kuda < 5 ? `nivel ${kuda} ➯ ${kuda + 1}\n│Exp: ${_kuda} -> ${kuda * 100}` : '' || kuda == 5 ? 'Nivel maximo' : ''}
╰──────────────
╭──────────────
│🐱 *Gato* ${kucing == 0 ? 'No tiene' : '' || kucing > 0 && kucing < 5 ? `nivel ${kucing} ➯ ${kucing + 1}\n│Exp: ${_kucing} -> ${kucing * 100}` : '' || kucing == 5 ? 'Nivel maximo' : ''}
╰──────────────

     *TOPS*
Top *${userslevel.indexOf(m.sender) + 1}* de *${userslevel.length}* en nivel 
Top *${usersmoney.indexOf(m.sender) + 1}* de *${usersmoney.length}* en dinero
Top *${usersdiamond.indexOf(m.sender) + 1}* de *${usersdiamond.length}* en diamantes 
Top *${userspotion.indexOf(m.sender) + 1}* de *${userspotion.length}* en pociones
Top *${userscommon.indexOf(m.sender) + 1}* de *${userscommon.length}* en cajas comunes
Top *${usersuncommon.indexOf(m.sender) + 1}* de *${usersuncommon.length}* en casa normales
Top *${usersmythic.indexOf(m.sender) + 1}* de *${usersmythic.length}* en cajas miticas
Top *${userslegendary.indexOf(m.sender) + 1}* de *${userslegendary.length}* en cajas legendarias
Top *${userssampah.indexOf(m.sender) + 1}* de *${userssampah.length}* en basura
`.trim()
    conn.sendMessage(m.chat, { contentText: str, footerText: '\n', buttons: [{buttonId: `${usedPrefix}shop`, buttonText: {displayText: 'Tienda ⛺'}, type: 1}], "headerType": "DOCUMENT", "documentMessage": { "url": "https://mmg.whatsapp.net/d/f/Ano5cGYOFQnC51uJaqGBWiCrSJH1aDCi8-YPQMMb1N1y.enc", "mimetype": "application/vnd.ms-excel", "title": "⤿❛ Gɑme - RPG ₊˚๑’-⁩", "fileSha256": "8Xfe3NQDhjwVjR54tkkShLDGrIFKR9QT5EsthPyxDCI=", "fileLength": 99999999999, "pageCount": "0", "mediaKey": "XWv4hcnpGY51qEVSO9+e+q6LYqPR3DbtT4iqS9yKhkI=", "fileName": "⤿❛ Gɑme - RPG ₊˚๑’-⁩", "fileEncSha256": "NI9ykWUcXKquea4BmH7GgzhMb3pAeqqwE+MTFbH/Wk8=", "directPath": "/v/t62.7119-24/35160407_568282564396101_3119299043264875885_n.enc?ccb=11-4&oh=d43befa9a76b69d757877c3d430a0752&oe=61915CEC", "mediaKeyTimestamp": "1634472176", "jpegThumbnail": false 
            }}, MessageType.buttonsMessage, { quoted: m, thumbnail: false, contextInfo: { mentionedJid: [m.sender], forwardingScore: 750, isForwarded: true, externalAdReply: { title: '❱ ❭❱ INVENTARIO ❰❬ ❰', thumbnail: invt, mediaType:"2", previewType: "VIDEO", mediaUrl: ""
            }
            }
            })
}
handler.help = ['inventario']
handler.tags = ['rpg']
handler.command = /^(inventario|inventory|inv)$/i
module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
