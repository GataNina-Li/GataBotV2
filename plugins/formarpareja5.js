let R = Math.random
let Fl = Math.floor
let toM = a => '@' + a.split('@')[0]
function handler(m, { groupMetadata }) {
    let ps = groupMetadata.participants.map(v => v.jid)
    let a = ps[Fl(R() * ps.length)]
    let b
    do b = ps[Fl(R() * ps.length)]
    while (b === a)
    let c
    do c = ps[Fl(R() * ps.length)]
    while (b === a)
    let d
    do d = ps[Fl(R() * ps.length)]
    while (b === a)
    let e
    do e = ps[Fl(R() * ps.length)]
    while (b === a)
    let f
    do f = ps[Fl(R() * ps.length)]
    while (b === a)
    let g
    do g = ps[Fl(R() * ps.length)]
    while (b === a)
    let h
    do h = ps[Fl(R() * ps.length)]
    while (b === a)
    let i
    do i = ps[Fl(R() * ps.length)]
    while (b === a)
    let j
    do j = ps[Fl(R() * ps.length)]
    while (b === a)
    m.reply(`*_😍 Las 5 maravillosas parejas del grupo 😍_*
    
*_1.- ${toM(a)} 💘 ${toM(b)}_* 
Que hermosa pareja 💖, me invitan a su Boda 🛐

*_2.- ${toM(c)} 💘 ${toM(d)}_*  
🌹 Ustedes se merecen lo mejor del mundo 💞

*_3.- ${toM(e)} 💘 ${toM(f)}_* 
Tan enamorados 😍, para cuando la familia 🥰

*_4.- ${toM(g)} 💘 ${toM(h)}_* 
💗 Decreto que ustedes son la pareja del Año 💗 

*_5.- ${toM(i)} 💘 ${toM(j)}_* 
Genial! 💝, están de Luna de miel 🥵✨❤️‍🔥`, null, {
        contextInfo: {
            mentionedJid: [a, b, c, d, e, f, g, h, i, j]
        }
    })
}
handler.help = ['formarpareja5']
handler.tags = ['main']
handler.command = ['formarparejas5','pareja5','formarpareja5']
handler.group = true

module.exports = handler
