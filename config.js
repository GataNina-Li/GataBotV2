global.DeveloperMode = 'false' //true Or false
global.linkGC = ['https://chat.whatsapp.com/KZXLDv3dSnCFamoE9k7xHl' , 'https://chat.whatsapp.com/HsAgYyjFZY2GEpfAJ5d91z' , 'https://chat.whatsapp.com/HcqFYHRRsCgAE8jTiNAdr4' , 'https://chat.whatsapp.com/Hxd9OI7hE1WHx2lpyDLdGN' , 'https://chat.whatsapp.com/FaQjUnyl7l8J5AsOxiIFl6' , 'https://chat.whatsapp.com/J41WjEVpwIFKeCQPjsexyY' , 'https://chat.whatsapp.com/FTXnYWTDcQ1JOetrUwXqq5' , 'https://chat.whatsapp.com/K7TsmqdqxhrGKERKLUDXBP' , 'https://chat.whatsapp.com/GERbj6rH4qQDjNElqfaczT' , 'https://chat.whatsapp.com/EwGG2i1ZuvG9pE6p9pNmIz'  , 'https://chat.whatsapp.com/LAuQljQEQmG9b16SNCwEAp'  , 'https://chat.whatsapp.com/DCoMwu0Hz992s9Aue78Fyi'  , 'https://chat.whatsapp.com/CHqovAky47lLRwJrIr5HFX'  , 'https://chat.whatsapp.com/BnWmn9edajT41nx9uj0fiM'  , 'https://chat.whatsapp.com/HTUBcz3zmSO1Ne766gema3'  , 'https://chat.whatsapp.com/I9KKHonMPR84YwicvLP5qn'  , 'https://chat.whatsapp.com/FCoP5zNCNraFdf3zMQkcRI'  , 'https://chat.whatsapp.com/BDbuqKSM7SZ42T2H2243n9'] // No tiene utilidad 
global.channelYT = ['https://www.youtube.com/channel/UCSTDMKjbm-EmEovkygX-lCA'] // No tiene utilidad
global.owner = ['18724659809' , '51913458682' , '51924591772', '51935596831] // Cambia los numeros por tu o tus numeros a los cuales te comtactaran y gestionaras el Bot
global.mods = ['5219992095479' , '972557048356'] // No tiene utilidad
global.prems = ['5219996125657' , '5219991402134'] // No tiene utilidad

// Nota: Puedes contactarme si necesitas ayuda con algo al +994407312387 (Solo temas de la instalación)
// => Solo dudas sobre la instalación, temas generales contactarme al +593968585383 (Temas serios, si vas a intervenir al chat para molesrtar seras bloqueado/a) 
// => NO ayudo a hacer Bots, ni crearlos, ni editarlos 
// - Este es el Canal de The Shadow Brokers por si te interesa su canal de YouTube en https://www.youtube.com/channel/UCSTDMKjbm-EmEovkygX-lCA

global.APIs = { // API Prefix
  // name: 'https://website'
  amel: 'https://melcanz.com',
  bx: 'https://bx-hunter.herokuapp.com',
  nrtm: 'https://nurutomo.herokuapp.com',
  xteam: 'https://api.xteam.xyz',
  nzcha: 'http://nzcha-apii.herokuapp.com',
  bg: 'http://bochil.ddns.net',
  fdci: 'https://api.fdci.se',
  dzx: 'https://api.dhamzxploit.my.id',
  bsbt: 'https://bsbt-api-rest.herokuapp.com',
  zahir: 'https://zahirr-web.herokuapp.com',
  zeks: 'https://api.zeks.me',
  hardianto: 'https://hardianto-chan.herokuapp.com',
  pencarikode: 'https://pencarikode.xyz', 
  LeysCoder: 'https://leyscoders-api.herokuapp.com',
  lol: 'https://api.lolhuman.xyz',
  pencarikode: 'https://pencarikode.xyz',
  Velgrynd: 'https://velgrynd.herokuapp.com',
  rey: 'https://server-api-rey.herokuapp.com',
  neoxr: 'https://api.neoxr.eu.org',
  hardianto: 'http://hardianto-chan.herokuapp.com'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://melcanz.com': 'DyotaMC05',
  'https://bx-hunter.herokuapp.com': 'Ikyy69',
  'https://api.xteam.xyz': '5bd33b276d41d6b4',
  'https://zahirr-web.herokuapp.com': 'zahirgans',
  'https://bsbt-api-rest.herokuapp.com': 'benniismael',
  'https://api.zeks.me': 'apivinz',
  'https://hardianto-chan.herokuapp.com': 'hardianto',
  'https://pencarikode.xyz': 'pais', 
  'https://leyscoders-api.herokuapp.com': 'MIMINGANZ', 
  'https://server-api-rey.herokuapp.com': 'apirey',
  'https://api.lolhuman.xyz': 'rey2k21'
}

// Sticker WM
global.packname = 'GataBot 🐈'
global.author = 'Gata Dios'


//global.wait = '*Esperé un momento..*'


global.multiplier = 69 // The higher, The harder levelup

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})
