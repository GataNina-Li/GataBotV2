const { MessageType } = require("@adiwajshing/baileys")

async function handler(m, { command }) {
    command = command.toLowerCase()
    this.anonymous = this.anonymous ? this.anonymous : {}
    switch (command) {
        case 'next':
        case 'leave': {
            let room = Object.values(this.anonymous).find(room => room.check(m.sender))
            if (!room) throw 'No estás en un chat anónimo'
            m.reply('Ok.. ha salido exitosamente')
            let other = room.other(m.sender)
            if (other) this.sendMessage(other, 'El otro usuario decidio abandonar el chat', MessageType.text)
            delete this.anonymous[room.id]
            if (command === 'leave') break
        }
        case 'start': {
            if (Object.values(this.anonymous).find(room => room.check(m.sender))) throw 'Sigues en el chat anónimo'
            let room = Object.values(this.anonymous).find(room => room.state === 'WAITING' && !room.check(m.sender))
            if (room) {
                this.sendMessage(room.a, 'Se conecto exitosamente con un chat anonimo!', MessageType.text)
                room.b = m.sender
                room.state = 'CHATTING'
                m.reply('Se conecto exitosamente con un chat anonimo!')
            } else {
                let id = + new Date
                this.anonymous[id] = {
                    id,
                    a: m.sender,
                    b: '',
                    state: 'WAITING',
                    check: function (who = '') {
                        return [this.a, this.b].includes(who)
                    },
                    other: function (who = '') {
                        return who === this.a ? this.b : who === this.b ? this.a : ''
                    },
                }
                m.reply('En espera de que un usuario use el comando para poder vincularlos.. esto puede demorar si desea salir use #leave')
            }
            break
        }
    }
}
handler.help = ['start', 'leave', 'next']
handler.tags = 'anonymous'

handler.command = ['start', 'leave', 'next']
handler.private = true

module.exports = handler
