let fs = require('fs')
let fetch = require('node-fetch')
let moment = require('moment-timezone')
let fakeImage = 'https://i.ibb.co/sgDvxrK/IMG-20210727-WA1305.jpg'
let safusimage = 'https://i.ibb.co/sgDvxrK/IMG-20210727-WA1305.jpg'
let fakeMessage = 'Team -MA🇮🇳'
const { MessageType } = require('@adiwajshing/baileys')
let path = require('path')
let levelling = require('../lib/levelling')
let handler = async (m, { conn, usedPrefix }) => {
let prep = await conn.prepareMessage(m.chat, fs.readFileSync('./Menu2.jpg'), MessageType.image, {})
let idd = prep.message
let pp = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  try {
    pp = await conn.getProfilePicture(who)
  } catch (e) {

  } finally {
await conn.fakeReply(m.chat, '*「 ⚠️ 」Loading...*', '0@s.whatsapp.net', '*LIST MENU*', 'status@broadcast', { thumbnail: await (await fetch(safusimage)).buffer()})
    let jam = moment.tz('Asia/Kolkata').format('HH')
    var ucapanWaktu = 'Good Morning 🌄'
				if (jam >= '03' && jam <= '10') {
				ucapanWaktu = 'Good Morning 🌄'
				} else if (jam >= '10' && jam <= '13') {
				ucapanWaktu = 'Good Afternoon ☀️'
				} else if (jam >= '13' && jam <= '18') {
				ucapanWaktu = 'Good eavening 🌅'
				} else if (jam >= '18' && jam <= '23') {
				ucapanWaktu = 'Good Night 🌙'
				} else {
				ucapanWaktu = 'Good Night 🌙'
				} 
				   let name = conn.getName(m.sender)
    let d = new Date
    let locale = 'en'
				    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
        let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
       let { exp, limit, registered, regTime, level, role } = global.DATABASE.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
       let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
let menu =`
╭──────────────────╮
│  *◩ ${ucapanWaktu} ◪*
╭──────────────────╯
╰──────────────────╮
│ *◩ ᴀʟɪᴇɴ-ᴀʟғᴀ⁴ ◪*
╭──────────────────╯
│
│ ▢ *ᴛɪᴍᴇ* : ${time}
│ ▢ *ᴅᴀᴛᴇ* : ${date}
│ ▢ *ᴜᴘᴛɪᴍᴇ* : ${uptime}
│ ▢ *ᴘʀᴇғɪx* : *[Multi Prefix]*
│https://chat.whatsapp.com/LOPN0xHy6KRJU1vReO9Nno
│     ▎▍▌▌▉▏▎▌▉▐▏▌▎
│     ▎▍▌▌▉▏▎▌▉▐▏▌▎
│      ©917012074386
│
╰──────────────────╮
╭──────────────────╯
│ *◩ user ◪*
╭──────────────────╯
│
│ ▢ *ʟɪᴍɪᴛ* : ${limit}
│ ▢ *ʀᴏʟᴇ* : ${role}
│ ▢ *ʟᴇᴠᴇʟ* : ${level}
│
╰──────────────────╯

╭──────────────────╮
│ *◩     ᴍᴀɪɴ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}afk 
│ ▢ ${usedPrefix}jadian 
│ ▢ ${usedPrefix}menu
│ ▢ ${usedPrefix}help
│ ▢ ${usedPrefix}rules
│ ▢ ${usedPrefix}donate
│ ▢ ${usedPrefix}?
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ɢᴀᴍᴇ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}asahotak
│ ▢ ${usedPrefix}caklontong
│ ▢ ${usedPrefix}family100
│ ▢ ${usedPrefix}math
│ ▢ ${usedPrefix}siapakahaku
│ ▢ ${usedPrefix}tebakgambar
│ ▢ ${usedPrefix}tebakkata
│ ▢ ${usedPrefix}tebakkimia
│ ▢ ${usedPrefix}tebaklagu 
│ ▢ ${usedPrefix}tictactoe 
│ ▢ ${usedPrefix}ttt 
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴇxᴘ&ʟɪᴍɪᴛ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}buy
│ ▢ ${usedPrefix}buy 
│ ▢ ${usedPrefix}buyall
│ ▢ ${usedPrefix}daily
│ ▢ ${usedPrefix}claim
│ ▢ ${usedPrefix}leaderboard 
│ ▢ ${usedPrefix}lb 
│ ▢ ${usedPrefix}levelup
│ ▢ ${usedPrefix}limit 
│ ▢ ${usedPrefix}pay 
│ ▢ ${usedPrefix}paylimit  
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     sᴛɪᴄᴋᴇʀ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}attp 
│ ▢ ${usedPrefix}attp2  
│ ▢ ${usedPrefix}ctrigger  
│ ▢ ${usedPrefix}getexif
│ ▢ ${usedPrefix}semoji 
│ ▢ ${usedPrefix}stiker 
│ ▢ ${usedPrefix}stiker 
│ ▢ ${usedPrefix}stikergif 
│ ▢ ${usedPrefix}stikergif 
│ ▢ ${usedPrefix}stikerline  
│ ▢ ${usedPrefix}stikertelegram  
│ ▢ ${usedPrefix}stikerly  
│ ▢ ${usedPrefix}stickfilter  
│ ▢ ${usedPrefix}stickmaker  
│ ▢ ${usedPrefix}togif 
│ ▢ ${usedPrefix}toimg 
│ ▢ ${usedPrefix}toimg2 
│ ▢ ${usedPrefix}tovideo 
│ ▢ ${usedPrefix}ttp 
│ ▢ ${usedPrefix}ttp2  
│ ▢ ${usedPrefix}ttpdark  
│ ▢ ${usedPrefix}wm 
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴍᴀɢɪᴄ sʜᴇʟʟ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}apakah 
│ ▢ ${usedPrefix}apakah 
│ ▢ ${usedPrefix}artinama 
│ ▢ ${usedPrefix}kapan 
│ ▢ ${usedPrefix}kapankah 
│ ▢ ${usedPrefix}kapan 
│ ▢ ${usedPrefix}kapankah 
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ǫᴜᴏᴛᴇs     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}bucin
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴀᴅᴅᴍɪɴ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}add 
│ ▢ ${usedPrefix}+ 
│ ▢ ${usedPrefix}demote 
│ ▢ ${usedPrefix}member 
│ ▢ ${usedPrefix}↓ 
│ ▢ ${usedPrefix}kick  
│ ▢ ${usedPrefix}-  
│ ▢ ${usedPrefix}demote 
│ ▢ ${usedPrefix}member 
│ ▢ ${usedPrefix}↓ 
│ ▢ ${usedPrefix}promote 
│ ▢ ${usedPrefix}admin 
│ ▢ ${usedPrefix}^ 
│ ▢ ${usedPrefix}↑ 
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ɢʀᴏᴜᴘ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}group *open / close*
│ ▢ ${usedPrefix}enable
│ ▢ ${usedPrefix}disable 
│ ▢ ${usedPrefix}getsider
│ ▢ ${usedPrefix}infogrup
│ ▢ ${usedPrefix}leavegc
│ ▢ ${usedPrefix}leavegcall
│ ▢ ${usedPrefix}leavegroup
│ ▢ ${usedPrefix}linkgroup
│ ▢ ${usedPrefix}here
│ ▢ ${usedPrefix}listonline
│ ▢ ${usedPrefix}opengumuman 
│ ▢ ${usedPrefix}oannounce 
│ ▢ ${usedPrefix}ohidetag 
│ ▢ ${usedPrefix}pengumuman 
│ ▢ ${usedPrefix}announce 
│ ▢ ${usedPrefix}hidetag 
│ ▢ ${usedPrefix}revoke
│ ▢ ${usedPrefix}setpp
│ ▢ ${usedPrefix}setbye 
│ ▢ ${usedPrefix}setwelcome 
│ ▢ ${usedPrefix}simulate  
│ ▢ ${usedPrefix}totalpesan
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴘʀᴇᴍɪᴜᴍ     ◪*
╭──────────────────╯
│ ▢
│ ▢ ${usedPrefix}join 
│ ▢
╰──────────────────╮
╭──────────────────╯
│ *◩     ɪɴᴛᴇʀɴᴇᴛ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}anime 
│ ▢ ${usedPrefix}brainly
│ ▢ ${usedPrefix}character 
│ ▢ ${usedPrefix}covid 
│ ▢ ${usedPrefix}darkjokes
│ ▢ ${usedPrefix}fetch 
│ ▢ ${usedPrefix}get 
│ ▢ ${usedPrefix}gimage 
│ ▢ ${usedPrefix}image 
│ ▢ ${usedPrefix}google 
│ ▢ ${usedPrefix}googlef 
│ ▢ ${usedPrefix}epep <id>
│ ▢ ${usedPrefix}katabijak 
│ ▢ ${usedPrefix}kbbi 
│ ▢ ${usedPrefix}lirik
│ ▢ ${usedPrefix}manga 
│ ▢ ${usedPrefix}resep 
│ ▢ ${usedPrefix}masak 
│ ▢ ${usedPrefix}megumin
│ ▢ ${usedPrefix}meme
│ ▢ ${usedPrefix}neko
│ ▢ ${usedPrefix}pikachu
│ ▢ ${usedPrefix}pinterest 
│ ▢ ${usedPrefix}ppcouple
│ ▢ ${usedPrefix}ppcp
│ ▢ ${usedPrefix}spotify 
│ ▢ ${usedPrefix}ss 
│ ▢ ${usedPrefix}ssf 
│ ▢ ${usedPrefix}subreddit 
│ ▢ ${usedPrefix}trendtwit
│ ▢ ${usedPrefix}trendingtwitter
│ ▢ ${usedPrefix}unsplash 
│ ▢ ${usedPrefix}waifu
│ ▢ ${usedPrefix}wallpaperanime 
│ ▢ ${usedPrefix}wallpaperq  
│ ▢ ${usedPrefix}wikipedia 
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴀɴᴏɴʏᴍᴏᴜs     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}start
│ ▢ ${usedPrefix}leave
│ ▢ ${usedPrefix}next
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴍᴀᴋᴇʀᴍᴇɴᴜ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}tahta  
│ ▢ ${usedPrefix}magernulis1  
│ ▢ ${usedPrefix}magernulis2  
│ ▢ ${usedPrefix}magernulis3  
│ ▢ ${usedPrefix}magernulis4  
│ ▢ ${usedPrefix}magernulis5  
│ ▢ ${usedPrefix}magernulis6  
│ ▢ ${usedPrefix}nulis 
│ ▢ ${usedPrefix}quotemaker 
│ ▢ ${usedPrefix}quotemaker2 
│ ▢ ${usedPrefix}tahta2
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩    ᴅᴏᴡɴʟᴏᴀᴅᴇʀ      ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}fb 
│ ▢ ${usedPrefix}ig 
│ ▢ ${usedPrefix}ighighlight 
│ ▢ ${usedPrefix}igstalk 
│ ▢ ${usedPrefix}igstory 
│ ▢ ${usedPrefix}play  
│ ▢ ${usedPrefix}play2  
│ ▢ ${usedPrefix}tiktok 
│ ▢ ${usedPrefix}twitter  
│ ▢ ${usedPrefix}ytmp3 
│ ▢ ${usedPrefix}yta 
│ ▢ ${usedPrefix}ytmp4 
│ ▢ ${usedPrefix}ytv 
│ ▢ ${usedPrefix}yt
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴛᴏᴏʟs     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}aksara 
│ ▢ ${usedPrefix}base64
│ ▢ ${usedPrefix}calc
│ ▢ ${usedPrefix}carigrup 
│ ▢ ${usedPrefix}caripesan 
│ ▢ ${usedPrefix}hd
│ ▢ ${usedPrefix}enhance 
│ ▢ ${usedPrefix}enphoto  
│ ▢ ${usedPrefix}gimage 
│ ▢ ${usedPrefix}image 
│ ▢ ${usedPrefix}githubsearch 
│ ▢ ${usedPrefix}hadis
│ ▢ ${usedPrefix}halah 
│ ▢ ${usedPrefix}hilih 
│ ▢ ${usedPrefix}huluh 
│ ▢ ${usedPrefix}heleh 
│ ▢ ${usedPrefix}holoh 
│ ▢ ${usedPrefix}tobraille
│ ▢ ${usedPrefix}inspect 
│ ▢ ${usedPrefix}kodepos 
│ ▢ ${usedPrefix}memeg
│ ▢ ${usedPrefix}mention 
│ ▢ ${usedPrefix}nulis2 
│ ▢ ${usedPrefix}profile 
│ ▢ ${usedPrefix}qr 
│ ▢ ${usedPrefix}qrcode 
│ ▢ ${usedPrefix}readmore 
│ ▢ ${usedPrefix}spoiler 
│ ▢ ${usedPrefix}run 
│ ▢ ${usedPrefix}scan 
│ ▢ ${usedPrefix}ping
│ ▢ ${usedPrefix}speed
│ ▢ ${usedPrefix}style 
│ ▢ ${usedPrefix}textpro 
│ ▢ ${usedPrefix}translate  
│ ▢ ${usedPrefix}tts  
│ ▢ ${usedPrefix}upload 
│ ▢ ${usedPrefix}wait 
│ ▢ ${usedPrefix}yts 
│ ▢ ${usedPrefix}ytsearch 
│ ▢ ${usedPrefix}zodiac *2002 02 25*
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ғᴜɴ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}dare
│ ▢ ${usedPrefix}jodoh 
│ ▢ ${usedPrefix}ref
│ ▢ ${usedPrefix}simi 
│ ▢ ${usedPrefix}simsimi 
│ ▢ ${usedPrefix}simih 
│ ▢ ${usedPrefix}truth
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴅᴀᴛᴀʙᴀsᴇ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}addvn 
│ ▢ ${usedPrefix}addmsg 
│ ▢ ${usedPrefix}addvideo 
│ ▢ ${usedPrefix}addgif 
│ ▢ ${usedPrefix}addaudio 
│ ▢ ${usedPrefix}addimg 
│ ▢ ${usedPrefix}addsticker 
│ ▢ ${usedPrefix}delcmd 
│ ▢ ${usedPrefix}delvn 
│ ▢ ${usedPrefix}delmsg 
│ ▢ ${usedPrefix}delvideo 
│ ▢ ${usedPrefix}delgif 
│ ▢ ${usedPrefix}delaudio 
│ ▢ ${usedPrefix}delimg 
│ ▢ ${usedPrefix}delsticker 
│ ▢ ${usedPrefix}getvn 
│ ▢ ${usedPrefix}getmsg 
│ ▢ ${usedPrefix}getvideo 
│ ▢ ${usedPrefix}getgif 
│ ▢ ${usedPrefix}getaudio 
│ ▢ ${usedPrefix}getimg 
│ ▢ ${usedPrefix}getsticker 
│ ▢ ${usedPrefix}infocmd 
│ ▢ ${usedPrefix}listcmd 
│ ▢ ${usedPrefix}listvn
│ ▢ ${usedPrefix}listmsg
│ ▢ ${usedPrefix}listvideo
│ ▢ ${usedPrefix}listgif
│ ▢ ${usedPrefix}listaudio
│ ▢ ${usedPrefix}listimg
│ ▢ ${usedPrefix}liststicker
│ ▢ ${usedPrefix}unlockcmd
│ ▢ ${usedPrefix}lockcmd
│ ▢ ${usedPrefix}setcmd 
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴠᴏᴛɪɴɢ      ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}cekvote
│ ▢ ${usedPrefix}hapusvote
│ ▢ ${usedPrefix}mulaivote 
│ ▢ ${usedPrefix}upvote
│ ▢ ${usedPrefix}devote
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴀʙsᴇɴᴛ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}absen
│ ▢ ${usedPrefix}cekabsen
│ ▢ ${usedPrefix}hapusabsen
│ ▢ ${usedPrefix}mulaiabsen 
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴀʟǫᴜʀᴀɴ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}alquran 114 1
│ ▢ ${usedPrefix}asmaulhusna 
│ ▢ ${usedPrefix}hadis
│ ▢ ${usedPrefix}salat 
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴄᴏɴɴᴇᴄᴛɪᴏɴ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}getcode
│ ▢ ${usedPrefix}jadibot 
│ ▢ ${usedPrefix}listjadibot
│ ▢ ${usedPrefix}berhenti
│ ▢ ${usedPrefix}stop
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴏᴡɴᴇʀ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}whitelist 
│ ▢ ${usedPrefix}addprem 
│ ▢ ${usedPrefix}banchat
│ ▢ ${usedPrefix}ban
│ ▢ ${usedPrefix}blocklist
│ ▢ ${usedPrefix}broadcast 
│ ▢ ${usedPrefix}bc 
│ ▢ ${usedPrefix}broadcastgroup 
│ ▢ ${usedPrefix}bcgc 
│ ▢ ${usedPrefix}clearchat
│ ▢ ${usedPrefix}clearchat 
│ ▢ ${usedPrefix}clearchat 
│ ▢ ${usedPrefix}clearchat 
│ ▢ ${usedPrefix}deletechat
│ ▢ ${usedPrefix}deletechat 
│ ▢ ${usedPrefix}deletechat 
│ ▢ ${usedPrefix}deletechat 
│ ▢ ${usedPrefix}mutechat
│ ▢ ${usedPrefix}mutechat 
│ ▢ ${usedPrefix}mutechat 
│ ▢ ${usedPrefix}mutechat
│ ▢ ${usedPrefix}delprem 
│ ▢ ${usedPrefix}enable 
│ ▢ ${usedPrefix}disable 
│ ▢ ${usedPrefix}premlist
│ ▢ ${usedPrefix}oadd 
│ ▢ ${usedPrefix}o+ 
│ ▢ ${usedPrefix}okick 
│ ▢ ${usedPrefix}o- 
│ ▢ ${usedPrefix}opromote 
│ ▢ ${usedPrefix}oadmin 
│ ▢ ${usedPrefix}o^ 
│ ▢ ${usedPrefix}setbotbio
│ ▢ ${usedPrefix}setbotname
│ ▢ ${usedPrefix}setbye 
│ ▢ ${usedPrefix}setmenu 
│ ▢ ${usedPrefix}setmenubefore 
│ ▢ ${usedPrefix}setmenuheader 
│ ▢ ${usedPrefix}setmenubody 
│ ▢ ${usedPrefix}setmenufooter 
│ ▢ ${usedPrefix}setmenuafter 
│ ▢ ${usedPrefix}setwelcome 
│ ▢ ${usedPrefix}simulate  
│ ▢ ${usedPrefix}unbanchat
│ ▢ ${usedPrefix}ban
│ ▢ ${usedPrefix}upsw  
│ ▢ ${usedPrefix}upsw 
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩    ʜᴏsᴛ      ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}broadcastjadibot 
│ ▢ ${usedPrefix}bcbot 
│ ▢ ${usedPrefix}debounce
│ ▢ ${usedPrefix}update
│ ▢ ${usedPrefix}update2
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴀᴅᴠᴀɴᴄᴇᴅ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}wanted
│ ▢ ${usedPrefix}wasted
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ɪɴғᴏ     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}Info
│ ▢ ${usedPrefix}bannedlist
│ ▢ ${usedPrefix}owner
│ ▢ ${usedPrefix}creator
│ ▢ ${usedPrefix}del
│ ▢ ${usedPrefix}delete
│ ▢ ${usedPrefix}donasi
│ ▢ ${usedPrefix}groups
│ ▢ ${usedPrefix}grouplist
│ ▢ ${usedPrefix}bug 
│ ▢ ${usedPrefix}report 
│ ▢ ${usedPrefix}ping
│ ▢ ${usedPrefix}speed
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩    ɴᴏ ᴄᴀᴛᴇɢᴏʀʏ      ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}save 
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩    ᴍᴀᴋᴇʀ      ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}gay
│ ▢ ${usedPrefix}trigger
│ ▢ ${usedPrefix}ytcomment 
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩    ʀᴇɢɪsᴛᴇʀ      ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}daftar 
│ ▢ ${usedPrefix}reg 
│ ▢ ${usedPrefix}register 
│ ▢ ${usedPrefix}unreg 
│ ▢ ${usedPrefix}unregister 
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩    ᴠɪᴅᴇᴏ ᴍᴀᴋᴇʀ      ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}shaunthesheep
│ 
╰──────────────────╮
╭──────────────────╯
│ *◩     ᴀᴜᴅɪᴏ ᴛᴏᴏʟs     ◪*
╭──────────────────╯
│ 
│ ▢ ${usedPrefix}tomp3 
│ ▢ ${usedPrefix}tovn 
│ ▢ ${usedPrefix}bass 
│ ▢ ${usedPrefix}blown 
│ ▢ ${usedPrefix}deep 
│ ▢ ${usedPrefix}earrape 
│ ▢ ${usedPrefix}fast 
│ ▢ ${usedPrefix}fat 
│ ▢ ${usedPrefix}nightcore 
│ ▢ ${usedPrefix}reverse 
│ ▢ ${usedPrefix}robot 
│ ▢ ${usedPrefix}slow 
│ ▢ ${usedPrefix}smooth 
│ ▢ ${usedPrefix}tupai 
│ 
╰──────────────────╯
${readMore}
╭──────────────────╮
│ *◩    ᴛʜᴀɴᴋs ᴛᴏ      ◪*
╭──────────────────╯
│ ▢•  sᴀғᴡᴀɴ ɢᴀɴᴢ
│ ▢•  ɴᴜʀᴜᴛᴏᴍᴏ
│ ▢•  ᴅʀᴀɢᴏɴ ʟᴏᴏᴘ
│ ▢•  ᴀᴅɪ ᴏғғɪᴄɪᴀʟ
│ ▢•  ᴛᴏxɪᴄ ᴀʟɪᴇɴ
│ ▢•  ʙɪᴋᴋᴜᴢ
╰──────────────────╯`.trim()

 const buttons = [{buttonId: 'id1', buttonText: {displayText: 'Nice🤖'}, type: 1}, {buttonId: '#donate', buttonText: {displayText: '🔮Donate'}, type: 1}]
  let id = Object.keys(idd)[0]
  const buttonMessage = {[id]: prep.message[id], contentText: menu, footerText: 'Created By Team Ma official🇮🇳', buttons: buttons, headerType: 'IMAGE'}
  conn.sendMessage(m.chat, buttonMessage, MessageType.buttonsMessage, { quoted: {key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' }, message: { orderMessage: { itemCount: 2021, status: 999, thumbnail: await (await fetch(safusimage)).buffer(), surface: 999, message: 'мᎪ ᴏғғɪᴄɪᴀʟあ', orderTitle: 'iOfficial', sellerJid: '0@s.whatsapp.net'}}}}, { contextInfo: { mentionedJid: [m.sender]}})


}}
handler.help = ['men', 'hel', '?']
handler.tags = ['main']
handler.command = /^(2help)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 5

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
