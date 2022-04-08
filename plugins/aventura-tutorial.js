let handler  = async (m, { conn, usedPrefix }) => {
  conn.reply(m.chat, `
╭─「 *Tutorial Main METRO BOT* 」
│ 
│〘 Tutorial EPIC RPG 〙
│• *${usedPrefix}claim*
│   Paquete de inicio reclamable 
│   cada 12 horas 
│• *${usedPrefix}mulung*
│• *${usedPrefix}adventure*
│• *${usedPrefix}petualang*
│   Para buscar recursos como Dinero,    
│   Exp, etc..., se necesita un mínimo
│   de 80 vidas para poder hacerlo y
│   no puedes enviar spam porque
│   hay un retraso de 5 minutos. 
│• *${usedPrefix}use potion <total>*
│   Para usar pociones debe 
│   llenar su vida/salud
│• *${usedPrefix}shop buy potion <total>*
│   Para comprar una poción, escribir
│   *${usedPrefix}use potion <total>*
│   usar pociones
│• *${usedPrefix}shop <args>*
│   comprar o vender algo
│• *${usedPrefix}shop buy <crate> <jumlah>*
│   Comprar Caja
│• *${usedPrefix}profile*
│• *${usedPrefix}pp*
│• *${usedPrefix}profil*
│   para saber tu número de whatsapp, etc.
│• *${usedPrefix}inv*
│• *${usedPrefix}inventory*
│• *${usedPrefix}bal*
│   Para comprobar la vida, el dinero, etc.
│• *${usedPrefix}judi <total>*
│   *_Jangan judi, Karena gk bakal_*
│   *_balik modal.BENERAN GK BOHONG_*
│  
│*©Metro Bot 2020-2021*
╰─「 *Tutorial Main METRO BOT* 」
`.trim(), m)
}
handler.help = ['tutorial']
handler.tags = ['about']
handler.command = /^(tutorial)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
