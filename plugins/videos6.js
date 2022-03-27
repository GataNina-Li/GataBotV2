let handler = async(m, { conn, usedPrefix, command }) => {
await conn.sendButtonVid(m.chat, pickRandom(asupan), '🔥🔥🔥🔥', 'Gata Dios', 'SIGUIENTE 🔄🥵', `${usedPrefix + command}`, m, false)
}
handler.command = /^(pornobivid|pornobisexualvid|Pornobivid|pornovidbi|pornovidbisexual|Pornovidbisexual|pornobiv|Pornobiv|pornovbi)$/i
module.exports = handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

const asupan = [
"https://k.top4top.io/m_2277tg6m70.mp4
  https://d.top4top.io/m_2277t2jeh0.mp4
 https://c.top4top.io/m_2277wxhle0.mp4 
"https://a.top4top.io/m_2263xdx270.mp4",
]
