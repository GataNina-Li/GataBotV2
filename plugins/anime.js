let fetch = require('node-fetch')

let handler = async(m, { conn, args, usedPrefix }) => {
    if (args.length == 0) return conn.reply(m.chat, `*Usted esta usando mal el comando ${usedPrefix}anime*\n\n*Usted debe usarlo de la siguiente manera: ${usedPrefix}anime (categoría)*\n\n*Ejemplo: ${usedPrefix}anime random*\n\n*categorías disponibles:*\n*random, waifu, husbu, neko*`, m)
    if (args[0] == 'random' || args[0] == 'waifu' || args[0] == 'husbu' || args[0] == 'neko') {
  await m.reply('*Agurde un momento...*')

        fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/anime/' + args[0] + '.txt')
            .then(res => res.text())
            .then(body => {
                let randomnime = body.split('\n')
                let randomnimex = randomnime[Math.floor(Math.random() * randomnime.length)]
                conn.sendFile(m.chat, randomnimex, '', '*7w7*', m)
            })
            .catch(() => {
                conn.reply(m.chat, 'Hubo un error, disculpe... ', m)
            })
    } else {
        conn.reply(m.chat, `*⚠️ Uso erróneo*\n\n*👉🏻 Uso correcto: ${usedPrefix}anime (categoría)*\n\n*🔰 Escriba ${usedPrefix}anime para ver la lista de categorías disponibles*`, m)
    }

}

handler.help = ['anime <query>']
handler.tags = ['anime']
handler.command = /^(anime)$/i

handler.fail = null
handler.limit = false

module.exports = handler