let handler  = async (m, { conn }) => {
  conn.reply(m.chat,`${pickRandom(global.iq)}`, m)
}
handler.help = ['iqtest']
handler.tags = ['game']
handler.command = /^(iqtest|iq|inteligencia)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

global.iq = [
'*Tu IQ es de: 1* 😿',
'*Tu IQ es de: 14* 🐓',
'*Tu IQ es de: 23* 👏',
'*Tu IQ es de: 35* 🦦',
'*Tu IQ es de: 41* ✅',
'*Tu IQ es de: 50* 👀',
'*Tu IQ es de: 67* 🦄',
'*Tu IQ es de: 72* ⭐️',
'*Tu IQ es de: 86* 🤍',
'*Tu IQ es de: 99* 🧠',
'*Tu IQ es de: 150* 😱',
'*Tu IQ es de: 340* 🐋',
'*Tu IQ es de: 423* 😌',
'*Tu IQ es de: 500* 🤑',
'*Tu IQ es de: 676* 💗',
'*Tu IQ es de: 780* 😳',
'*Tu IQ es de: 812* 😽',
'*Tu IQ es de: 945* 😎',
'*Tu IQ es de: 1000* 💥',
'*Tu IQ es de: Ilimitado!!* 👑',
'*Tu IQ es de: 5000* 😼',
'*Tu IQ es de: 7500* 🏆',
'*Tu IQ es de: 10000* ✨',
]
