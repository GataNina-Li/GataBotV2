let handler = m => m
let debugMode = !1

let winScore = 500
let playScore = 50

handler.before = function (m) {
    let ok
    let isWin = !1
    let isTie = !1
    let isSurrender = !1
    this.game = this.game ? this.game : {}
    let room = Object.values(this.game).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
    if (room) {
        // m.reply(`[DEBUG]\n${parseInt(m.text)}`)
        if (!/^([1-9]|(me)?salir|surr?ender)$/i.test(m.text)) return !0
        isSurrender = !/^[1-9]$/.test(m.text)
        if (m.sender !== room.game.currentTurn) { // nek wayahku
            if (!isSurrender) return !0
        }
        if (debugMode) m.reply('[DEBUG]\n' + require('util').format({
            isSurrender,
            text: m.text
        }))
        if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
            m.reply({
                '-3': 'El juego ha terminado',
                '-2': 'Inválido',
                '-1': 'Posición inválida',
                0: 'Posición inválida',
            }[ok])
            return !0
        }
        if (m.sender === room.game.winner) isWin = true
        else if (room.game.board === 511) isTie = true
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
        if (isSurrender) {
            room.game._currentTurn = m.sender === room.game.playerX
            isWin = true
        }
        let winner = isSurrender ? room.game.currentTurn : room.game.winner
        let str = `
*## GATO / 3 EN RAYA ##*

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

*${isWin ? `@${winner.split('@')[0]} gano la partida!!!* (+${winScore} XP)` : isTie ? `*El Juego ha terminado* (+${playScore} XP)` : `*Es turno de:* ${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`}
*❌: @${room.game.playerX.split('@')[0]}*
*⭕: @${room.game.playerO.split('@')[0]}*
*- Si la partida aun no acaba puede utilizar la palabra "salir", no escriba ningun prefijo ni las " ni las * ni los ~ y el mensaje debe ser respondiendo al mensaje del Bot en donde salga la tabla del juego. También puede usar el comando #delttt ~nombre de la sala~ para eliminar la sala de juego*
`.trim()
        let users = global.DATABASE._data.users
        if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
            room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
        if (room.x !== room.o) m.reply(str, room.x, {
            contextInfo: {
                mentionedJid: this.parseMention(str)
            }
        })
        m.reply(str, room.o, {
            contextInfo: {
                mentionedJid: this.parseMention(str)
            }
        })
        if (isTie || isWin) {
            users[room.game.playerX].exp += playScore
            users[room.game.playerO].exp += playScore
            if (isWin) users[winner].exp += winScore - playScore
            if (debugMode) m.reply('[DEBUG]\n' + require('util').format(room))
            delete this.game[room.id]
        }
    }
    return !0
}

module.exports = handler