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
    m.reply(`*_Hey!!! ${toM(a)}, ${toM(b)} y ${toM(c)} han pensado en hacer un trio? ustedes 3 hacen un buen trio 🥵_*`, null, {
        contextInfo: {
            mentionedJid: [a, b, c],
        }
    })
}
handler.help = ['formartrio']
handler.tags = ['General']
handler.command = ['formartrio','formartrios']
handler.group = true

module.exports = handler
