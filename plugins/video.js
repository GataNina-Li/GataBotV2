let util = require('util')
let path = require('path')
let fs = require('fs')

let caption = `
🥵🔥🔥🔥🔥
`.trim()

let handler = async (m, { conn }) => {
let video = fs.readFileSync(`./videos/${pickRandom(['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41'])}.mp4`)

     conn.sendFile(m.chat, video, '1.mp4', caption, m)
}
handler.command = /^video|vídeo$/i
module.exports = handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
