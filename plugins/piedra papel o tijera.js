let handler = async (m, { text, usedPrefix }) => {
    let salah = `*_Hola! 👋 bienvenido/a al juego de piedra, papel o tijera_*\n\n*_Opciones Disponibles:_*\n*_piedra, papel o tijera_*\n\n*_${usedPrefix}ppt tijera_*\n\n*_Use las opciones en minusculas como se indica en el ejemplo, no use los _ ni los * para que el Bot lo detecte correctamente_*\n\n🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈`
    if (!text) throw salah
    var astro = Math.random()

    if (astro < 0.34) {
        astro = 'piedra' 
    } else if (astro > 0.34 && astro < 0.67) {
        astro = 'tijera' 
    } else {
        astro = 'papel'
    }

    if (text == astro) {
        m.reply(`*_🤝 Empate!_*\n\n*👉 Usted: ${text}*\n*👉 El Bot: ${astro}*`)
        } else if (text == 'papel') {
        if (astro == 'piedra') {
            global.DATABASE._data.users[m.sender].money += 1000
            m.reply(`*🥳 Tú ganas! 🎉*\n\n*👉 Usted: ${text}*\n*👉 El Bot: ${astro}*`)
        } else {
            m.reply(`*☠️ Tú pierdes! ❌*\n\n*👉 Usted: ${text}*\n*👉 El Bot: ${astro}*`)
        }
        } else if (text == 'tijera') {
        if (astro == 'papel') {
            global.DATABASE._data.users[m.sender].uang += 1000
            m.reply(`*🥳 Tú ganas! 🎉*\n\n*👉 Usted: ${text}*\n*👉 El Bot: ${astro}*`)
        } else {
            m.reply(`*☠️ Tú pierdes! ❌*\n\n*👉 Usted: ${text}*\n*👉 El Bot: ${astro}*`)
        }
            } else if (text == 'tijera') {
        if (astro == 'papel') {
            global.DATABASE._data.users[m.sender].uang += 1000
            m.reply(`*🥳 Tú ganas! 🎉*\n\n*👉 Usted: ${text}*\n*👉 El Bot: ${astro}*`)
        } else {
            m.reply(`*☠️ Tú pierdes! ❌*\n\n*👉 Usted: ${text}*\n*👉 El Bot: ${astro}*`)
        }
        } else if (text == 'papel') {
        if (astro == 'piedra') {
            global.DATABASE._data.users[m.sender].uang += 1000
            m.reply(`*🥳 Tú ganas! 🎉*\n\n*👉 Usted: ${text}*\n*👉 El Bot: ${astro}*`)
        } else {
            m.reply(`*☠️ Tú pierdes! ❌*\n\n*👉 Usted: ${text}*\n*👉 El Bot: ${astro}*`)
        }
        } else if (text == 'piedra') {
        if (astro == 'tijera') {
            global.DATABASE._data.users[m.sender].uang += 1000
            m.reply(`*🥳 Tú ganas! 🎉*\n\n*👉 Usted: ${text}*\n*👉 El Bot: ${astro}*`)
        } else {
            m.reply(`*☠️ Tú pierdes! ❌*\n\n*👉 Usted: ${text}*\n*👉 El Bot: ${astro}*`)
        }
        } else {
        throw salah
    }
}
handler.help = ['ppt']
handler.tags = ['game']
handler.command = /^(ppt)$/i
handler.register = false
handler.limit = false

module.exports = handler
