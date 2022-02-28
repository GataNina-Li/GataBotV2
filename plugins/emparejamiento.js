let R = Math.random
let Fl = Math.floor
let toM = a => '@' + a.split('@')[0]
function handler(m, { groupMetadata }) {
    let ps = groupMetadata.participants.map(v => v.jid)
    let a = ps[Fl(R() * ps.length)]
    let b
    do b = ps[Fl(R() * ps.length)]
    while (b === a)
    m.reply(`*_Oye ${toM(a)}, deberias casarte 💍 con  ${toM(b)}_*`, null, {
        contextInfo: {
            mentionedJid: [a, b],
        }
    })
}
handler.help = ['formarpareja']
handler.tags = ['main']
handler.command = ['formarpareja','formarparejas'] 
handler.group = true

module.exports = handler
