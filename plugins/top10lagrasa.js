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
    m.reply(`*_Uwu TOP 10 LA GRASA  Uwu:_* 
    
 *_1.- Bv ${toM(a)} Bv_* 
 *_2.- :v ${toM(b)} :v_* 
 *_3.- :D ${toM(c)} :D_* 
 *_4.- Owo ${toM(d)} Owo_* 
 *_5.- U.u ${toM(e)} U.u_* 
 *_6.- >:v ${toM(f)} >:v_* 
 *_7.- :'v ${toM(g)} :'v_*
 *_8.- ._. ${toM(h)} ._._* 
 *_9.- :V ${toM(i)} :V_* 
 *_10.- XD ${toM(j)} XD_*`, null, {
        contextInfo: {
            mentionedJid: [a, b, c, d, e, f, g, h, i, j]
        }
    })
}
handler.help = ['top10lagrasa','top10grasa']
handler.tags = ['main']
handler.command = ['top10lagrasa','top10Lagrasa','top10grasa','toplagrasa','topgrasa|']
handler.group = true 

module.exports = handler
