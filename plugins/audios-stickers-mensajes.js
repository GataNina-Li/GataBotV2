let { MessageType } = require("@adiwajshing/baileys");
let util = require('util')
let path = require('path')
let fs = require("fs")
let fetch = require('node-fetch')

let handler = m => m

handler.before = async function (m, { conn, command }) {
if ((m.isBaileys && m.fromMe) || m.fromMe ) return true

let audio1A = /noche de paz|Noche de paz|Noche de amor|noche de amor|Noche de Paz/i
let audio1B = audio1A.exec(m.text)

let audio2A = /bot te amo|te amo bot/i
let audio2B = audio2A.exec(m.text)

let audio3A = /bot eres hombre o mujer/i
let audio3B = audio3A.exec(m.text)

let audio4A = /a mimir/i
let audio4B = audio4A.exec(m.text)

let audio5A = /pasen hentai|pasen hentay|antojen/i
let audio5B = audio5A.exec(m.text)

let audio6A = /eres gay|que gay/i
let audio6B = audio6A.exec(m.text)

let audio7A = /mirame/i
let audio7B = audio7A.exec(m.text)

let audio8A = /😭|:"c|:'c/i
let audio8B = audio8A.exec(m.text)

let audio9A = /error/i
let audio9B = audio9A.exec(m.text)

let audio10A = /estoy aburrid|ando aburrid|que aburrid/i
let audio10B = audio10A.exec(m.text)

let audio11A = /leche/i
let audio11B = audio11A.exec(m.text)

let audio12A = /jajajaja/i
let audio12B = audio12A.exec(m.text)

let audio13A = /suicidar/i
let audio13B = audio13A.exec(m.text)

let audio14A = /puto bot|bot puto|pvto bot|bot pvto/i
let audio14B = audio14A.exec(m.text)

let audio15A = /^(A|ª|ᵃ|a)$/i
let audio15B = audio15A.exec(m.text)

let audio16A = /Bot|bot/i
let audio16B = audio16A.exec(m.text)


//Mensaje new
//let texto1A = /No tengo hermana|No tengo ermana/i
//let texto1B = texto1A.exec(m.text)

if (audio1B) {
	let vn = './media/Noche.mp3'
	conn.sendFile(m.chat, vn, 'Noche.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	} else

if (audio2B) {
	let vn = './storage/audio/Yo_igual_te_amo_pero.mp3'
	conn.sendFile(m.chat, vn, 'Yo_igual_te_amo_pero.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	} else

if (audio3B) {
	let vn = './storage/audio/Tontito_soy_hombre.mp3'
	conn.sendFile(m.chat, vn, 'Tontito_soy_hombre.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	} else

if (audio4B) {
	let vn = './storage/audio/Tienes_que_mimir.mp3'
	conn.sendFile(m.chat, vn, 'Tienes_que_mimir.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	} else

if (audio5B) {
	let au = ["./storage/audio/Pensamientos_sexuales.mp3", "./storage/audio/No_te_da_verguenza.mp3"]
	let vn = au[Math.floor(Math.random() * au.length)]
	conn.sendFile(m.chat, vn, 'Pensamientos_verguensa.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	} else

if (audio6B) {
	let vn = './storage/audio/Ok_maricon.mp3'
	conn.sendFile(m.chat, vn, 'Ok_maricon.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	} else

if (audio7B) {
	let vn = './storage/audio/No_miro_personas_lindas.mp3'
	conn.sendFile(m.chat, vn, 'No_miro_personas_lindas.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	} else

if (audio8B) {
	let vn = './storage/audio/No_llores_onii-chan.mp3'
	conn.sendFile(m.chat, vn, 'No_llores_onii-chan.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	} else

if (audio9B) {
	let vn = './storage/audio/Me_cago_en_la_concha.mp3'
	conn.sendFile(m.chat, vn, 'Me_cago_en_la_concha.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	} else

if (audio10B) {
	let vn = './storage/audio/Juguemos_al_ascensor.mp3'
	conn.sendFile(m.chat, vn, 'Juguemos_al_ascensor.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	} else

if (audio11B) {
	let vn = './storage/audio/Esto_no_es_leche.mp3'
	conn.sendFile(m.chat, vn, 'Esto_no_es_leche.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	} else

if (audio12B) {
        let tt = ["./storage/audio/Eres_muy_chistoso.mp3", "./storage/audio/Gracioso_te_crees.mp3"]
	let vn = tt[Math.floor(Math.random() * tt.length)]
	conn.sendFile(m.chat, vn, 'Gracioso.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	} else

if (audio13B) {
	let vn = './storage/audio/El_suicidio_no_es_una_opcion.mp3'
	conn.sendFile(m.chat, vn, 'El_suicidio_no_es_una_opcion.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	}

if (audio14B) {
	let vn = './storage/audio/Deje_de_insultarme.mp3'
	conn.sendFile(m.chat, vn, 'Deje_de_insultarme.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	}

if (audio15B) {
	let vn = './storage/audio/A.mp3'
	conn.sendFile(m.chat, vn, 'A.mp3', null, m, true, { type: 'audioMessage', ptt: true })
	}
/*
if (audio16B) {
	let vn = './storage/sticker/Bot.webp'
        let pp = await conn.getProfilePicture(m.sender) 
        let ppp = await(await fetch(pp)).buffer()
        conn.sendMessage(m.chat, fs.readFileSync(vn), MessageType.sticker, { quoted: m, contextInfo: { externalAdReply: {title: conn.getName(m.sender), body:"© lolibot", previewType: "PHOTO", thumbnail: ppp, sourceUrl:``}}})
        }



//Mensaje new
if (texto1B) {
        conn.sendMessage(m.chat, 'En ese caso el tuyo 7w7', MessageType.text, { sendEphemeral: true, quoted: m })
        }



} */ 

module.exports = handler
