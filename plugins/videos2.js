let handler = async(m, { conn, usedPrefix, command }) => {
await conn.sendButtonVid(m.chat, pickRandom(asupan), '🥵🔥', 'Gata Dios', 'SIGUIENTE', `${usedPrefix + command}`, m, false)
}
handler.command = /^porno01$/i
module.exports = handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

const asupan = [
"https://b.top4top.io/m_2257pugx00.mp4",
"https://i.top4top.io/m_225756xso0.mp4",
"https://f.top4top.io/m_2235sxi5y1.mp4",
"https://e.top4top.io/m_2257di15t0.mp4",
]
