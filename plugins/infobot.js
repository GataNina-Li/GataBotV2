let os = require('os')
let util = require('util')
let { performance } = require('perf_hooks')
let { sizeFormatter } = require('human-readable')
let format = sizeFormatter({
  std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})
let handler = async (m, { conn, usedPrefix }) => {
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime) 
  let totalreg = Object.keys(global.DATABASE._data.users).length
  const chats = conn.chats.all()
  const groups = chats.filter(v => v.jid.endsWith('g.us'))
  const groupsIn = groups.filter(v => !v.read_only)
  const used = process.memoryUsage()
  const cpus = os.cpus().map(cpu => {
    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
    return cpu
  })
  const cpu = cpus.reduce((last, cpu, _, { length }) => {
    last.total += cpu.total
    last.speed += cpu.speed / length
    last.times.user += cpu.times.user
    last.times.nice += cpu.times.nice
    last.times.sys += cpu.times.sys
    last.times.idle += cpu.times.idle
    last.times.irq += cpu.times.irq
    return last
  }, {
    speed: 0,
    total: 0,
    times: {
      user: 0,
      nice: 0,
      sys: 0,
      idle: 0,
      irq: 0
    }
  })
  let old = performance.now()
  //await m.reply('_Realizando test_')
  let neww = performance.now()
  let totaljadibot = [...new Set([...global.conns.filter(conn => conn.user && conn.state !== 'close').map(conn => conn.user)])]
  let speed = neww - old
  let info = `
╠═〘 *Informacion del Bot* 〙 ═
╠
╠➥ [🤴🏻] Creador del Bot: *Bruno Sobrino*
╠➥ [#️⃣] Numero del creador: *+1 (772) 238-6341*
╠➥ [🌐] Navegador: *${conn.browserDescription[1]}*
╠➥ [✅] version: *${conn.browserDescription[2]}*
╠➥ [🎳] Prefijo: *${usedPrefix}*
╠➥ [👨‍🦯] Velocidad: *${speed} milisegundos*
╠➥ [🔐] Chat Privado: *${chats.length - groups.length}*
╠➥ [🦜] Chat de Grupos: *${groups.length}* 
╠➥ [💡] Chat Totales: *${chats.length}* 
╠➥ [🚀] Tiempo activo: *${uptime}*
╠➥ [🎩] Usuarios: *${totalreg} numeros*
╠➥ [🔋] Bateria: *${conn.battery ? `${conn.battery.value}%* *${conn.battery.live ? '🔌 Cargando...*' : '⚡ Desconectado*'}` : 'Desconocido*'}
╠➥ [📲] Sistema operativo: *${conn.user.phone.device_manufacturer}*
╠➥ [🪀] version de WhatsApp: *${conn.user.phone.wa_version}*
╠➥ [🤖] Bots secundarios activos: *${totaljadibot.length}*
╠
╠═〘 *The Shadow Brokers - Bot* 〙 ═
`.trim() 
  conn.fakeReply(m.chat, info, '0@s.whatsapp.net', '*🔥 THE SHADOW BROKERS - BOT 🔥*', 'status@broadcast')
}
//handler.help = ['ping', 'speed']
//handler.tags = ['info', 'tools']

handler.command = /^(infobot)$/i

module.exports = handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}
