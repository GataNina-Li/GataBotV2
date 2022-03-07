let util = require('util')
let path = require('path')
let fs = require('fs')

let caption = `
🥵🔥🔥🔥🔥
`.trim()

let handler = async (m, { conn }) => {
let video = fs.readFileSync(`./videos2/${pickRandom(['1a','2a','3a'])}.mp4`)

     conn.sendFile(m.chat, video, '1a.mp4', caption, m)
}
handler.command = /^video2|vídeo2$/i
module.exports = handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
