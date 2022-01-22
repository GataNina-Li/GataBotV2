let fetch = require('node-fetch')
let split = '|'
let handler = async (m, { conn, args: [effect], text: txt }) => {
  let { effects } = await (await (fetch(global.API('xteam', '/ephoto')))).json()
  if (!effect) throw '*[❗] Lista de efectos disponibles*\n\n*Ejemplo de uso:*\n*#logos2 neon Shadow*\n\n' + effects.sort((a, b) => a - b).join('\n')
  effect = effect.toLowerCase()
  if (!effect in effects) throw `*[❗] El efecto ${effect} no se encuentra en la base de datos*`
  let [text, text2, ...text3] = txt.replace(effect, '').trimStart().split(split)
  text3 = text3.join(split)
  let url = global.API('xteam', '/ephoto/' + effect, { text, text2, text3 }, 'APIKEY')
  await conn.sendFile(m.chat, url, 'error.jpg', `*DISEÑO TERMINADO*\n*Efecto:* ${effect}`, m)
}
handler.help = ['enphoto'].map(v => v + ' <effect> <text>|[text2]|[text3]')
handler.tags = ['tools']
handler.command = /^(logos2)$/i

module.exports = handler
