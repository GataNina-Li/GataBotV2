let handler = async(m, { conn, usedPrefix, command }) => {
await conn.sendButtonVid(m.chat, pickRandom(asupan), '🔥🔥🔥🔥', 'Gata Dios', 'SIGUIENTE 🔄🥵', `${usedPrefix + command}`, m, false)
}
handler.command = /^(pornovid|pornovideo|Pornovid|Pornovideo|Pornvid|Ponrvid|pornvid|ponrvid|pornov)$/i
module.exports = handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

const asupan = [
"https://b.top4top.io/m_2257pugx00.mp4",
"https://i.top4top.io/m_225756xso0.mp4",
"https://h.top4top.io/m_22573rdw80.mp4",
"https://f.top4top.io/m_2235sxi5y1.mp4",
"https://f.top4top.io/m_2257ofv9s0.mp4",
"https://e.top4top.io/m_2257scyvl1.mp4",
"https://e.top4top.io/m_2257di15t0.mp4",
"https://d.top4top.io/m_225754y5s0.mp4",
"https://j.top4top.io/m_22573jxk20.mp4",
"https://g.top4top.io/m_2257lw1620.mp4",
"https://d.top4top.io/m_2257puxyo0.mp4",
"https://e.top4top.io/m_2257bb1an0.mp4",
"https://a.top4top.io/m_2257utyrp0.mp4",
"https://b.top4top.io/m_22571xiss0.mp4",
"https://a.top4top.io/m_2257tgfkz0.mp4",
]
