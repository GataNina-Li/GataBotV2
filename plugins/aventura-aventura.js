let { MessageType } = require('@adiwajshing/baileys')
const cooldown = 300000
let handler = async (m, { conn, usedPrefix, DevMode }) => {
    try {
        let __timers = (new Date - global.DATABASE._data.users[m.sender].lastadventure)
        let _timers = (cooldown - __timers)
        let timers = clockString(_timers)
        if (global.DATABASE._data.users[m.sender].healt >= 79) {
            if (new Date - global.DATABASE._data.users[m.sender].lastadventure > cooldown) {
                let armor = global.DATABASE._data.users[m.sender].armor
                let rubah = global.DATABASE._data.users[m.sender].rubah
                let kuda = global.DATABASE._data.users[m.sender].kuda
                let kucing = global.DATABASE._data.users[m.sender].kucing
                let ____health = `${Math.floor(Math.random() * 101)}`.trim()
                let ___health = (____health * 1)
                let kucingnya = (kucing == 0 ? 0 : '' || kucing == 1 ? 5 : '' || kucing == 2 ? 10 : '' || kucing == 3 ? 15 : '' || kucing == 4 ? 21 : '' || kucing == 5 ? 30 : '')
                let armornya = (armor == 0 ? 0 : '' || armor == 1 ? 5 : '' || armor == 2 ? 10 : '' || armor == 3 ? 15 : '' || armor == 4 ? 21 : '' || armor == 5 ? 30 : '')
                let __health = (___health > 60 ? ___health - kucingnya - armornya : ___health)
                let healt = (kucing == 0 && armor == 0 ? pickRandom(['100', '99', '98', '97', '96', '95', '94', '93', '92', '91', '90']) : kucing > 0 && armor > 0 ? __health : ___health)
                let exp = (Math.floor(Math.random() * 400) + (kuda * 70))
                let uang = `${Math.floor(Math.random() * 400)}`.trim()
                let _potion = `${Math.floor(Math.random() * 2)}`.trim()
                let potion = (_potion * 1)
                let _diamond = (rubah == 0 ? pickRandom(['0', '1', '0', '1', '0', '1', '0']) : '' || rubah == 1 ? pickRandom(['0', '1', '0', '1']) : '' || rubah == 2 ? pickRandom(['0', '1', '0', '1', '2']) : '' || rubah == 3 ? pickRandom(['0', '1', '0', '2', '2', '0']) : '' || rubah == 4 ? pickRandom(['0', '1', '1', '2', '1', '1', '0']) : '' || rubah == 5 ? pickRandom(['0', '0', '1', '2', '2', '1', '1', '0']) : '')
                let diamond = (_diamond * 1)
                let _common = `${Math.floor(Math.random() * 3)}`.trim()
                let common = (_common * 1)
                let _uncommon = `${Math.floor(Math.random() * 2)}`.trim()
                let uncommon = (_uncommon * 1)
                let _mythic = `${pickRandom(['1', '0', '0', '1'])}`
                let mythic = (_mythic * 1)
                let _legendary = `${pickRandom(['1', '0', '0', '0'])}`
                let sampah = `${Math.floor(Math.random() * 300)}`.trim()
                let legendary = (_legendary * 1)
                let str = `
*Tu vida se reduce ⬇️❤‍🩹 -${healt * 1} porque fuiste 🛣️ ${pickRandom(['a las tierras perdidas', 'al vale de Kara', 'a Beleriand', 'a la ciudad de fuego', 'a Camorrus', 'al fin del horizonte', 'al grito de cuervo', 'al valle del anochecer'])} y obtienes:*

🤺 *Exp:* ${exp} 
💵 *Dinero:* ${uang}
🗑️ *Basura:* ${sampah}${potion == 0 ? '' : '\n🔮 *Pocion:* ' + potion + ''}${diamond == 0 ? '' : '\n- Diamantes: ' + diamond + ''}${common == 0 ? '' : '\n- Cajas comunes: ' + common + ''}${uncommon == 0 ? '' : '\n- Caja poco común: ' + uncommon + ''}
`.trim()
                conn.reply(m.chat, str, m)
                if (mythic > 0) {
                    global.DATABASE._data.users[m.sender].mythic += mythic * 1
                    conn.reply(m.chat, '🥳 *Felicidades, obtienes un artículo raro*\n' + mythic + ' Caja mitica', m)
                }
                if (legendary > 0) {
                    global.DATABASE._data.users[m.sender].legendary += legendary * 1
                    conn.reply(m.chat, '🤩 *Felicidades, obtienes un artículo épico*\n' + legendary + ' Caja legendaria', m)
                }
                global.DATABASE._data.users[m.sender].healt -= healt * 1
                global.DATABASE._data.users[m.sender].exp += exp * 1
                global.DATABASE._data.users[m.sender].money += uang * 1
                global.DATABASE._data.users[m.sender].potion += potion * 1
                global.DATABASE._data.users[m.sender].diamond += diamond * 1
                global.DATABASE._data.users[m.sender].common += common * 1
                global.DATABASE._data.users[m.sender].uncommon += uncommon * 1
                global.DATABASE._data.users[m.sender].sampah += sampah * 1
                global.DATABASE._data.users[m.sender].lastadventure = new Date * 1
            } else conn.reply(m.chat, `Te quedaste sin energía vuelve dentro de *${timers}*`, m)
        } else conn.reply(m.chat, `🤏 *Mínimo 80 de 💖 salud para poder ir de aventura* 🤺\n\nPuedes comprar 🛍️ *pociones de vida* con el comando:\n• ${usedPrefix}tienda comprar pocion *cantidad*`, m)
    } catch (e) {
        console.log(e)
        conn.reply(m.chat, 'Error', m)
        if (DevMode) {
            let file = require.resolve(__filename)
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.sendMessage(jid, file + ' error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
            }
        }
    }
}
handler.help = ['adventure']
handler.tags = ['rpg']
handler.command = /^(adventure|aventura|explorar)$/i

handler.cooldown = cooldown

module.exports = handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function clockString(seconds) {
  d = Math.floor(seconds / (1000 * 60 * 60 * 24));
  h = Math.floor((seconds / (1000 * 60 * 60)) % 24);
  m = Math.floor((seconds / (1000 * 60)) % 60);
  s = Math.floor((seconds / 1000) % 60);
  
  dDisplay = d > 0 ? d + (d == 1 ? " dia," : " Dias,") : "";
  hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " Horas, ") : "";
  mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " Minutos, ") : "";
  sDisplay = s > 0 ? s + (s == 1 ? " segundo" : " Segundos") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};
