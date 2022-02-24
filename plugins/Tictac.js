const TicTacToe = require("../lib/tictactoe")

let handler = async (m, { conn, usedPrefix, command, text }) => {
    conn.game = conn.game ? conn.game : {}
    if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) throw '😺 *Aún estas en una sala de juego* 😺\n\n*👉 Para dejar de jugar escribe "salir" (sin prefijo) respondiendo al mensaje del inicio que envio el Bot*\n\n*También puedes eliminar la sala escribiendo #delttt _nombre de la sala_*'
    let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
    // m.reply('[WIP Feature]')
    if (room) {
        m.reply('*✅ Un jugador ingreso a la sala*')
        room.o = m.chat
        room.game.playerO = m.sender
        room.state = 'PLAYING'
        let arr = room.game.render().map(v => {
            return {
                X: '❌',
                O: '⭕',
                1: '1️⃣',
                2: '2️⃣',
                3: '3️⃣',
                4: '4️⃣',
                5: '5️⃣',
                6: '6️⃣',
                7: '7️⃣',
                8: '8️⃣',
                9: '9️⃣',
            }[v]
        })
        let str = `
⭕️ *Clasico juego de gato o 3 en raya* ❌
*¿Como jugar? R//* _Responde al mensaje que envie el Bot con la tablita del juego, el mensaje debe contener la posiscion en la que quieras estar (1,2,3,4,5,6,7,8,9)_

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

*Es turno de @${room.game.currentTurn.split('@')[0]}*
*- Para rendirse puede utulizar la palabra "salir", no escriba ningun prefijo ni las " ni las * y el mensaje debe ser respondiendo al mensaje del Bot en donde salga la tabla del juego.*
`.trim()
        if (room.x !== room.o) m.reply(str, room.x, {
            contextInfo: {
                mentionedJid: conn.parseMention(str)
            }
        })
        m.reply(str, room.o, {
            contextInfo: {
                mentionedJid: conn.parseMention(str)
            }
        })
    } else {
        room = {
            id: 'tictactoe-' + (+new Date),
            x: m.chat,
            o: '',
            game: new TicTacToe(m.sender, 'o'),
            state: 'WAITING'
        }
        if (text) room.name = text
        m.reply('*🔁 Esperando a que el jugador 2 se una a la sala.* ' + (text ? `*El jugador 2 debe escribir el comando a continuación respetando las mayúsculas, puntos y acentuaciónes:*
${usedPrefix}${command} ${text}` : ''))
        conn.game[room.id] = room
    }
}

handler.help = ['tictactoe', 'ttt'].map(v => v + ' [custom room name]') 
handler.tags = ['']
handler.command = /^(tictactoe|t{3})$/

module.exports = handler
