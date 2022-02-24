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
    m.reply(`*_🌸TOP 10 OTAKUS DEL GRUPO🌸_*
    
*_1.- 💮${toM(a)}💮_*
*_2.- 🌷${toM(b)}🌷_*
*_3.- 💮${toM(c)}💮_*
*_4.- 🌷${toM(d)}🌷_*
*_5.- 💮${toM(e)}💮_*
*_6.- 🌷${toM(f)}🌷_*
*_7.- 💮${toM(g)}💮_*
*_8.- 🌷${toM(h)}🌷_*
*_9.- 💮${toM(i)}💮_*
*_10.- 🌷${toM(j)}🌷_*`, null, {
        contextInfo: {
            mentionedJid: [a, b, c, d, e, f, g, h, i, j]
        }
    })  
}
handler.help = ['toppt']
handler.tags = ['main']
handler.command = ['topotakus','topotaku','topotak','toptakus']
handler.group = true

module.exports = handler
