let handler  = async (m, { conn, usedPrefix: _p }) => {
let info = `
╭════• ೋ•✧๑♡๑✧•ೋ •════╮
🔰 *Gata Dios* tiene funciones que pertenezcan a las sigiuentes Empresa(s)|Organizacion(es)|Persona(s) 🔰

BochilGaming
Games-Wabot

BrunoSobrino
The Shadow Brokers

Tobi
LolizitaBOT

ConfuMods
Alcatraz

Samu330
NyanBot

Bot Tiburon
BOT
╰════• ೋ•✧๑♡๑✧•ೋ •════╯
`.trim() 

conn.fakeReply(m.chat, info, '0@s.whatsapp.net', '🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈', 'status@broadcast')
}
handler.command = /^(creditos|CREDITOS|Creditos|Credito|Crédito)$/i

module.exports = handler
