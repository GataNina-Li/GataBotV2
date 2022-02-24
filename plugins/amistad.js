let R = Math.random
let Fl = Math.floor
let toM = a => '@' + a.split('@')[0] 
function handler(m, { groupMetadata }) {
    let ps = groupMetadata.participants.map(v => v.jid)
    let a = ps[Fl(R() * ps.length)]
    let b
    do b = ps[Fl(R() * ps.length)]
    while (b === a)
    m.reply(`*_🤗 Vamos a hacer algunas amistades 🤗_*\n\n*_Oye 👀 ${toM(a)} hablale al privado a ${toM(b)} para que jueguen y se haga una amistad 🙆_*\n\n*_Las mejores amistades empiezan con un juego 😉_*`, null, {
        contextInfo: {
            mentionedJid: [a, b],
        }
    })
}
handler.help = ['amigorandom']
handler.tags = ['main']
handler.command = ['amigo','amigorandom','amistad']
handler.group = true

module.exports = handler
