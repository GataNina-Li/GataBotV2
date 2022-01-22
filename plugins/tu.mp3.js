let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/Tu.mp3'
conn.sendFile(m.chat, vn, 'Tu.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true
})
}
handler.customPrefix = /Quién es tu senpai botsito 7u7|Quien es tu senpai botsito 7u7|Quién es tu sempai botsito 7u7|Quien es tu sempai botsito 7u7|Quién es tu senpai botsito 7w7|Quien es tu senpai botsito 7w7|quién es tu senpai botsito 7u7|quien es tu senpai botsito 7u7|Quién es tu sempai botsito 7w7|Quien es tu sempai botsito 7w7/
handler.command = new RegExp
module.exports = handler