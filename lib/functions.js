const fetch = require('node-fetch')
const spin = require('spinnies')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const FileType = require('file-type')
const Crypto = require('crypto')
const {exec} = require('child_process')
const fakeUa = require('fake-useragent')
const { MessageType,Mimetype } = require('@adiwajshing/baileys')


const h2k = (number) => {
    var SI_POSTFIXES = ["", " K", " M", " G", " T", " P", " E"]
    var tier = Math.log10(Math.abs(number)) / 3 | 0
    if(tier == 0) return number
    var postfix = SI_POSTFIXES[tier]
    var scale = Math.pow(10, tier * 3)
    var scaled = number / scale
    var formatted = scaled.toFixed(1) + ''
    if (/\.0$/.test(formatted))
      formatted = formatted.substr(0, formatted.length - 2)
    return formatted + postfix
}

const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}

const randomBytes = (length) => {
    return Crypto.randomBytes(length)
}

const generateMessageID = () => {
    return randomBytes(10).toString('hex').toUpperCase()
}

const getGroupAdmins = (participants) => {
	admins = []
	for (let i of participants) {
		i.isAdmin ? admins.push(i.jid) : ''
	}
	return admins
}

const NumberRandom = (output) => {
	return `${Math.floor(Math.random() * 10000)}${output}`
}

const spinner = { 
  "interval": 120,
  "frames": [
"🕐",
"🕑",
"🕒",
"🕓",
"🕔",
"🕕",
"🕖",
"🕗",
"🕘",
"🕙",
"🕚",
"🕛"
    ]}

let globalSpinner;

const getGlobalSpinner = (disableSpins = false) => {
  if(!globalSpinner) globalSpinner = new spin({ color: 'blue', succeedColor: 'green', spinner, disableSpins});
  return globalSpinner;
}

spins = getGlobalSpinner(false)

const start = (id, text) => {
	spins.add(id, {text: text})
	}
const info = (id, text) => {
	spins.update(id, {text: text})
}
const success = (id, text) => {
	spins.succeed(id, {text: text})
	}
const close = (id, text) => {
	spins.fail(id, {text: text})
}


WAConnection = (_WAConnection) =>  {
    class WAConnection extends _WAConnection {
		 async reply(mess, text, opt) {
		  return await this.sendMessage(mess.key.remoteJid, text, MessageType.extendedText, { quoted:mess, ...opt})
		  } 
     async sendFile(jid, path, filename = '', caption = '', quoted, options = {}) {
          let res
	  	  let file = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (res = await fetch(path, { headers: { 'User-Agent': fakeUa()}})).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : typeof path === 'string' ? path : Buffer.alloc(0)
  		  let type = await FileType.fromBuffer(file)
  		  if (!type) {
  		   options.asDocument = true
  		   type = {
           mime: 'application/octet-stream',
           ext: '.bin'
            }
  		   }
          if (res && res.status !== 200) {
           try { throw { json: JSON.parse(file) } }
           catch (e) { if (e.json) throw e.json }
      }
  		let opt = { filename, caption }
      if (quoted) opt.quoted = quoted
      if (!type) {
        if (!options.asDocument && typeof file === 'string') {
          delete opt.filename
          delete opt.caption
          let typeMsg = quoted ? MessageType.extendedText : MessageType.text
          return await this.sendMessage(jid, [file, caption].join('\n\n\n').trim(), typeMsg, opt)
        } else options.asDocument = true
      }
  		let mtype = ''
      if (!options.asDocument) {
    		if (/image/.test(type.mime)) mtype = MessageType.image
    		else if (/video/.test(type.mime)) mtype = MessageType.video
     		else opt.caption = filename
     		if (/audio/.test(type.mime)) {
    			mtype = MessageType.audio
          if (!options.ptt) opt.mimetype = 'audio/mp4'
    		} else if (/pdf/.test(type.ext)) { 
          mtype = MessageType.document
          opt.mimetype = type.mime
        }
      } else {
        mtype = MessageType.document
        opt.mimetype = type.mime
      }
      delete options.asDocument
      if (!opt.caption) delete opt.caption
  		return await this.sendMessage(jid, file, mtype, {...opt, ...options})
  	  }
     async downloadM(m, save) { 
      	if (!m) return Buffer.alloc(0) 	
      	if (!m.message) m.message = { m }	 
      	if (!m.message[Object.keys(m.message)[0]].url) await this.updateMediaMessage(m) 	 
      	if (save) return this.downloadAndSaveMediaMessage(m) 	
      	return await this.downloadMediaMessage(m) 	
      }
     async getBuffer(path,save){
       let buffer = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path, { headers: { 'User-Agent': fakeUa()}})).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : typeof path === 'string' ? path : Buffer.alloc(0)
       if (save) {
       fs.writeFileSync(save,buffer)
       return {filname: save,buffer}
       } else {
        return buffer
       }
      }
     async sendMessageFromContent(jid,obj,opt){
     let option = {
     contextInfo: {},
     ...opt
     }
     let prepare = await this.prepareMessageFromContent(jid,obj,option)
    await this.relayWAMessage(prepare)
    return prepare
     }
     async fakeReply(jid,message,type,opt,fakeJid,participant,fakeMessage){
     return await this.sendMessage(jid,message,type,{
  quoted: { key: {fromMe: jid == this.user.jid, participant,remoteJid: fakeJid },
"message": fakeMessage}, 
...opt
})
     }
     async prepareSticker(path,exifFile){
       let buf = await this.getBuffer(path)
       let { ext } = await FileType.fromBuffer(buf)
       if (!fs.existsSync("./tmp")) fs.mkdirSync('tmp')
       let fileName = `./tmp/${Date.now()}.${ext}`
       let output = fileName.replace(ext,'webp')
       fs.writeFileSync(fileName,buf)
       if (ext == 'webp'){
         if (exifFile){
         return new Promise((resolve,reject) => {
         exec(`webpmux -set exif ${exifFile} ${output} -o ${output}`,(err) => { 
           if (err) throw err 
        let result = fs.readFileSync(output)
       fs.unlinkSync(output)
       resolve(result)
         })
         })
         } else {
       let result = fs.readFileSync(output)
       fs.unlinkSync(output)
       return result
         }
       }
       return new Promise(async(resolve,reject) => {
         await ffmpeg(fileName).input(fileName).on('error', function (err) { 
           fs.unlinkSync(fileName)
           reject(err)
}).on('end', function () {
if (exifFile) {
exec(`webpmux -set exif ${exifFile} ${output} -o ${output}`,(err) => { 
if (err) return err
let result = fs.readFileSync(output)
fs.unlinkSync(fileName)
fs.unlinkSync(output)
resolve(result)
})
} else {
let result = fs.readFileSync(output)
fs.unlinkSync(fileName)
fs.unlinkSync(output)
resolve(result)
}
}).addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`]).toFormat('webp').save(output)
       })
     }
     async sendImage(jid,path,caption,quoted,opt){
     let buff = await this.getBuffer(path)
     return await this.sendMessage(jid,buff,'imageMessage',{quoted,caption,thumbnail: buff,...opt})
     }
     async sendVideo(jid,path,caption,quoted,opt){
     let buff = await this.getBuffer(path)
     return await this.sendMessage(jid,buff,'videoMessage',{quoted,caption,...opt})
     }
     async sendLocation(jid,property,opt){
     return await this.sendMessageFromContent(jid,{locationMessage: property},opt)
     }
     async sendLiveLocation(jid,property,opt){
     return await this.sendMessageFromContent(jid,{liveLocationMessage:property},opt)
     }
     async sendProduct(jid,property,opt){
      return await this.sendMessageFromContent(jid,{productMessage:property},opt)
     }
      async sendSticker(jid,path,opt,exifFile){
       let prepare;
       if (exifFile){
         prepare = await this.prepareSticker(path,exifFile)
       } else {
       prepare = await this.prepareSticker(path)
       }
       return await this.sendMessage(jid,prepare,MessageType.sticker,opt)
     }
    }
      return WAConnection

 }


createExif = (packname, authorname, filename) => {
        if (!filename) filename = 'data'
        const json = {
            'sticker-pack-id': 'CreateByAqul-RemasteredByZbin',
            'sticker-pack-name': packname,
            'sticker-pack-publisher': authorname,
        }
        let len = JSON.stringify(json).length
        const f = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])
        const code = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]
        if (len > 256) {
            len = len - 256
            code.unshift(0x01)
        } else {
            code.unshift(0x00)
        }
        const fff = Buffer.from(code)
        const ffff = Buffer.from(JSON.stringify(json))
        if (len < 16) {
            len = len.toString(16)
            len = '0' + len
        } else {
            len = len.toString(16)
        }
        const ff = Buffer.from(len, 'hex')
        const buffer = Buffer.concat([f, ff, fff, ffff])
        if (!fs.existsSync('tmp')) fs.mkdirSync('tmp')
        return fs.writeFileSync(`./tmp/${filename}.exif`, buffer)
    }


module.exports = { getBuffer, h2k, generateMessageID, getGroupAdmins, NumberRandom, start, info, success, close,WAConnection,createExif}