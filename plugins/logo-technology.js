//CREDITOS: https://github.com/BrunoSobrino
let fetch = require('node-fetch')
let handler = async (m, { conn, args }) => {
response = args.join(' ').split('|')
if (!args[0]) throw '*❰ ❗️ ❱ Ingrese un texto*\n*Ejemplo:*\n*#technology Gata*'        
let res = `https://api-alc.herokuapp.com/api/textpro/futuristic-technology?texto=${response[0]}&apikey=ConfuMods`
conn.sendFile(m.chat, res, 'error.jpg', `✅ *¡Logo terminado!*`, m, false)}
handler.command = /^(technology|tecnologia)$/i
module.exports = handler
