let limit = 10
let handler = async(m, { conn, text }) => {
if (!text) return conn.reply(m.chat, 'Masukkan text yang Anda inginkan', m)
if (text > 10) return conn.reply(m.chat, '*Text terlalu panjang sayang!*\n_Maksimal 10 huruf!_', m)
let link = 'https://api.zeks.xyz/api/crismes?text=' + text + '&apikey=apivinz'
conn.sendFile(m.chat, link, 'Error.png', '*Dulce navidad 🎄🎁*', m)
}
handler.help = ['crismes <text>']
handler.tags = ['creator']
handler.command = /^(crismeslogo)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.register = false
handler.fail = null

handler.limit = false
module.exports = handler
