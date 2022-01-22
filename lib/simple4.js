const fs = require('fs')
const util = require('util')
const path = require('path')
const FileType = require('file-type')
const fetch = require('node-fetch')
const PhoneNumber = require('awesome-phonenumber')
const { MessageType, WAMessageProto } = require('@adiwajshing/baileys')
const { toAudio, toPTT, toVideo } = require('./converter')
const { WAConnection } = require('@adiwajshing/baileys/lib/WAConnection/0.Base')

exports.WAConnection = _WAConnection => {
  class WAConnection extends _WAConnection {
    constructor(...args) {
      super(...args)
      if (!Array.isArray(this._events['CB:action,add:relay,message'])) this._events['CB:action,add:relay,message'] = [this._events['CB:action,add:relay,message']]
      else this._events['CB:action,add:relay,message'] = [this._events['CB:action,add:relay,message'].pop()]
      this._events['CB:action,add:relay,message'].unshift(async function (json) {
        try {
          let m = json[2][0][2]
          if (m.message && m.message.protocolMessage && m.message.protocolMessage.type == 0) {
            let key = m.message.protocolMessage.key
            let c = this.chats.get(key.remoteJid)
            let a = c.messages.dict[`${key.id}|${key.fromMe ? 1 : 0}`]
            let participant = key.fromMe ? this.user.jid : a.participant ? a.participant : key.remoteJid
            let WAMSG = WAMessageProto.WebMessageInfo
            this.emit('message-delete', { key, participant, message: WAMSG.fromObject(WAMSG.toObject(a)) })
          }
        } catch (e) { }
      })
      this.on(`CB:action,,battery`, json => {
        this.battery = Object.fromEntries(Object.entries(json[2][0][1]).map(v => [v[0], eval(v[1])]))
      })


      // Alias
      this.sendFileFromUrl = this.sendFileFromURL = this.sendFile
    }

    /**
     * Exact Copy Forward
     * @param {String} jid 
     * @param {Object} message 
     * @param {Boolean} forceForward 
     * @param {Object} options 
     */
    async copyNForward(jid, message, forceForward = false, options = {}) {
      let mtype = Object.keys(message.message)[0]
      let content = await this.generateForwardMessageContent(message, forceForward)
      let ctype = Object.keys(content)[0]
      let context = {}
      if (mtype != MessageType.text) context = message.message[mtype].contextInfo
      content[ctype].contextInfo = {
        ...context,
        ...content[ctype].contextInfo
      }
      const waMessage = await this.prepareMessageFromContent(jid, content, options ? {
        ...content[ctype],
        ...options,
        ...(options.contextInfo ? {
          contextInfo: {
            ...content[ctype].contextInfo,
            ...options.contextInfo
          }
        } : {})
      } : {})
      await this.relayWAMessage(waMessage)
      return waMessage
    }
    
   async sendSticker(jid, media, m, opts = {}) {
   let convert = require('./sticker').sticker
   let medias = await this.getFile(media)
   return this.sendMessage(jid, await convert(medias.data, null, opts.packname || 'Whatsapp Bot', opts.author || this.user.name), 'stickerMessage', { quoted: m, ...opts })
   }
   
    cMod(jid, message, text = '', sender = this.user.jid, options = {}) {
      let copy = message.toJSON()
      let mtype = Object.keys(copy.message)[0]
      let isEphemeral = mtype === 'ephemeralMessage'
      if (isEphemeral) {
        mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
      }
      let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
      let content = msg[mtype]
      if (typeof content === 'string') msg[mtype] = text || content
      else if (content.caption) content.caption = text || content.caption
      else if (content.text) content.text = text || content.text
      if (typeof content !== 'string') msg[mtype] = { ...content, ...options }
      if (copy.participant) sender = copy.participant = sender || copy.participant
      else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
      if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
      else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
      copy.key.remoteJid = jid
      copy.key.fromMe = sender === this.user.jid
      return WAMessageProto.WebMessageInfo.fromObject(copy)
    }
   async getMe() {
   let { hours, minutes, seconds } = await require('parse-ms')(process.uptime() * 1000)
    let ress = {}
    ress.botname = this.user.name
    ress.jid = this.user.jid
    ress.imgUrl = await this.getProfilePicture(this.user.jid)
    ress.bio = (await this.getStatus(this.user.jid)).status
    ress.uptime = `${hours}:${minutes}:${seconds}`
    ress.os = {}
    ress.os.hostname = require('os').hostname()
    ress.os.version = require('os').version()
    ress.os.platform = require('os').platform()
    ress.os.version = require('os').version()
    return ress
    }
    async genOrderMessage(message, options) {
      let m = {}
      switch (type) {
        case MessageType.text:
        case MessageType.extendedText:
          if (typeof message === 'string') message = { text: message }
          m.extendedTextMessage = WAMessageProto.ExtendedTextMessage.fromObject(message);
          break
        case MessageType.location:
        case MessageType.liveLocation:
          m.locationMessage = WAMessageProto.LocationMessage.fromObject(message)
          break
        case MessageType.contact:
          m.contactMessage = WAMessageProto.ContactMessage.fromObject(message)
          break
        case MessageType.image:
        case MessageType.sticker:
        case MessageType.document:
        case MessageType.video:
        case MessageType.audio:
          m = await this.prepareMessageMedia(message, type, options)
          break
        case 'orderMessage':
          m.orderMessage = WAMessageProto.OrderMessage.fromObject(message)
      }
      return WAMessageProto.Message.fromObject(m);
    }

    waitEvent(eventName, is = () => true, maxTries = 25) {
      return new Promise((resolve, reject) => {
        let tries = 0
        let on = (...args) => {
          if (++tries > maxTries) reject('Max tries reached')
          else if (is()) {
            this.off(eventName, on)
            resolve(...args)
          }
        }
        this.on(eventName, on)
      })
    }

    /**
     * Send Contact
     * @param {String} jid 
     * @param {String|Number} number 
     * @param {String} name 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    async sendContact(jid, number, name, quoted, options) {
      // TODO: Business Vcard
      number = number.replace(/[^0-9]/g, '')
      let njid = number + '@s.whatsapp.net'
      let { isBusiness } = await this.isOnWhatsApp(njid) || { isBusiness: false }
      let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name.replace(/\n/g, '\\n')};;;
FN:${name.replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}${isBusiness ? `
X-WA-BIZ-NAME:${(this.contacts[njid].vname || this.getName(njid)).replace(/\n/, '\\n')}
X-WA-BIZ-DESCRIPTION:${((await this.getBusinessProfile(njid)).description || '').replace(/\n/g, '\\n')}
` : ''}
END:VCARD
`.trim()
      return await this.sendMessage(jid, {
        displayName: name,
        vcard
      }, MessageType.contact, { quoted, ...options })
    }
     async sendContactArray(jid, kon, opts = {}) {
     let list = []
     for (let i of kon) {
  list.push({ "displayName": this.getName(i), "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:${this.getName(i)}\nFN:${this.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` })
  }
        return this.sendMessage(jid, {
        "displayName": `${list.length} kontak`,
        "contacts": list 
        }, 'contactsArrayMessage', opts)
        }
        
        async rejectIncomingCall(jid, id) {
        const tag = this.generateMessageTag();
        const nodePayload = ['action', 'call', ['call', {
                    'from': this.user.jid,
                    'to': `${jid.split('@')[0]}@s.whatsapp.net`,
                    'id': tag
                }, [['reject', {
                            'call-id': id,
                            'call-creator': `${jid.split('@')[0]}@s.whatsapp.net`,
                            'count': '0'
                        }, null]]]];
        const response = await this.sendJSON(nodePayload, tag);
        return response;
    }
    
    async sendGroupV4Invite(jid, participant, inviteCode, inviteExpiration, groupName = 'unknown subject', caption = 'Invitation to join my WhatsApp group', options = {}) {
      let msg = WAMessageProto.Message.fromObject({
        groupInviteMessage: WAMessageProto.GroupInviteMessage.fromObject({
          inviteCode,
          inviteExpiration: parseInt(inviteExpiration) || + new Date(new Date + (3 * 86400000)),
          groupJid: jid,
          groupName: groupName ? groupName : this.getName(jid),
          caption
        })
      })
      let message = await this.prepareMessageFromContent(participant, msg, options)
      await this.relayWAMessage(message)
      return message
    }
    /*  
   * Get All Groups
   * @param {String}
   */
     async getGroup(totalchat) {
 let grup = []
	let a = []
	let b = []
	for (let c of totalchat){
		a.push(c.jid)
	}
	for (let d of a){
		if (d && d.includes('g.us')){
			b.push(d)
		}
	}
	for (let e of b){
		let ingfo = await this.groupMetadata(e)
		grup.push(ingfo)
	}
	return grup
}
  /*  
   * Get Group Admins
   * @param {String}
   */
  async getAdmins(jid) {
  if (!jid.endsWith('g.us')) throw `${jid} is Not Group!`
  let { participants } = await this.groupMetadata(jid)
  return participants.filter(a => a.isAdmin)
  }
    /**
     * getBuffer hehe
     * @param {String|Buffer} path 
     */
    async getFile(path) {
      let res
      let data = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (res = await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : typeof path === 'string' ? path : Buffer.alloc(0)
      if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
      let type = await FileType.fromBuffer(data) || {
        mime: 'application/octet-stream',
        ext: '.bin'
      }

      return {
        res,
        ...type,
        data
      }
    }

    /**
     * Send Media/File with Automatic Type Specifier
     * @param {String} jid 
     * @param {String|Buffer} path 
     * @param {String} filename 
     * @param {String} caption 
     * @param {Object} quoted 
     * @param {Boolean} ptt 
     * @param {Object} options 
     */
    async sendFile(jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) {
      let type = await this.getFile(path)
      let { res, data: file } = type
      if (res && res.status !== 200 || file.length <= 65536) {
        try { throw { json: JSON.parse(file.toString()) } }
        catch (e) { if (e.json) throw e.json }
      }
      let opt = { filename, caption }
      if (quoted) opt.quoted = quoted
      if (!type) if (options.asDocument) options.asDocument = true
      let mtype = ''
      if (options.asSticker) mtype = MessageType.sticker
      else if (!options.asDocument && !options.type) {
        if (options.force) file = file
        else if (/audio/.test(type.mime)) file = await (ptt ? toPTT : toAudio)(file, type.ext)
        else if (/video/.test(type.mime)) file = await toVideo(file, type.ext)
        if (/webp/.test(type.mime) && file.length <= 1 << 20) mtype = MessageType.sticker
        else if (/image/.test(type.mime)) mtype = MessageType.image
        else if (/video/.test(type.mime)) mtype = MessageType.video
        else opt.displayName = opt.caption = filename
        if (options.asGIF && mtype === MessageType.video) mtype = MessageType.gif
        if (/audio/.test(type.mime)) {
          mtype = MessageType.audio
          if (!ptt) opt.mimetype = 'audio/mp4'
          opt.ptt = ptt
        } else if (/pdf/.test(type.ext)) mtype = MessageType.pdf
        else if (!mtype) {
          mtype = MessageType.document
          opt.mimetype = type.mime
        }
      } else {
        mtype = options.type ? options.type : MessageType.document
        opt.mimetype = type.mime
      }
      delete options.asDocument
      delete options.asGIF
      delete options.asSticker
      delete options.type
      if (mtype === MessageType.document) opt.title = filename
      if (mtype === MessageType.sticker || !opt.caption) delete opt.caption
      return await this.sendMessage(jid, file, mtype, { ...opt, ...options })
    }

    /**
     * Reply to a message
     * @param {String} jid 
     * @param {String|Object} text 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    reply(jid, text, quoted, options) {
      return Buffer.isBuffer(text) ? this.sendFile(jid, text, 'file', '', quoted, false, options) : this.sendMessage(jid, text, MessageType.extendedText, { contextInfo: { mentionedJid: this.parseMention(text), forwardingScore: 99999, isForwarded: true }, quoted, ...options })
    }
    
    /**
     * Send Buttons
     * @param {String} jid
     * @param {String} content
     * @param {String} footer
     * @param {String} button1
     * @param {String} row1
     * @param {Object} quoted
     * @param {Object} options
     */
    async sendButton(jid, content, footer, button1, row1, quoted, options = {}) {
      return await this.sendMessage(jid, {
        contentText: content,
        footerText: footer,
        buttons: [
          { buttonId: row1, buttonText: { displayText: button1 }, type: 1 }
        ],
        headerType: 1
      }, MessageType.buttonsMessage, { quoted, ...options })
    }
    
    /**
     * Send Button with Image
     * @param {String} jid
     * @param {Buffer} buffer
     * @param {String} content
     * @param {String} footer
     * @param {String} button1
     * @param {String} row1
     * @param {String} button2
     * @param {String} row2
     * @param {String} button3
     * @param {String} row3
     * @param {Object} quoted
     * @param {Object} options
     */
    async sendButtonImg(jid, buffer, content, footer, button1, row1, quoted, options = {}) {
      return await this.sendMessage(jid, {
        contentText: content,
        footerText: footer,
        buttons: [
          { buttonId: row1, buttonText: { displayText: button1 }, type: 1 }
        ],
        headerType: 4,
        imageMessage: (await this.prepareMessageMedia(buffer, MessageType.image, {})).imageMessage
      }, MessageType.buttonsMessage, {
        quoted, ...options
      })
    }
    
    /**
         * Send Buttons with Location
         * @param {String} jid
         * @param {Buffer} buffer
         * @param {String} content
         * @param {String} footer
         * @param {String} button1
         * @param {String} row1
         * @param {String} button2
         * @param {String} row2
         * @param {String} button3
         * @param {String} row3
         * @param {Object} quoted
         * @param {Object} options
         */
    async sendButtonLoc(jid, buffer, content, footer, button1, row1, quoted, options = {}) {
      return await this.sendMessage(jid, {
        locationMessage: { jpegThumbnail: buffer },
        contentText: content,
        footerText: footer,
        buttons: [{ buttonId: row1, buttonText: { displayText: button1 }, type: 1 }],
        headerType: 6
      }, MessageType.buttonsMessage, { quoted, ...options })
    }

    /**
     * Fake Replies
     * @param {String} jid 
     * @param {String|Object} text 
     * @param {String} fakeJid 
     * @param {String} fakeText 
     * @param {String} fakeGroupJid 
     * @param {String} options 
     */
    fakeReply(jid, text = '', fakeJid = this.user.jid, fakeText = '', fakeGroupJid, options) {
      return this.reply(jid, text, { key: { fromMe: fakeJid == this.user.jid, participant: fakeJid, ...(fakeGroupJid ? { remoteJid: fakeGroupJid } : {}) }, message: { conversation: fakeText }, ...options })
    }

    /**
     * Fake replies #2
     * @param {String} jid 
     * @param {String|Object} message 
     * @param {String} type 
     * @param {String} sender 
     * @param {String|Object} message2 
     * @param {String} type2 
     * @param {Object} options 
     * @param {Object} options2 
     * @param {String} remoteJid 
     */
    async fakeReply2(jid, message, type, sender, message2, type2, options = {}, options2 = {}, remoteJid) {
      let quoted = await this.prepareMessage(jid, message2, type2, options2)
      quoted = this.cMod(jid, quoted, undefined, sender)
      if (remoteJid) quoted.key.remoteJid = remoteJid
      else delete quoted.key.remoteJid

      return await this.prepareMessage(jid, message, type, { quoted, ...options })
    }
    /**
     * Inspect Link Group Invite 
     * @param {String} text 
     */
   async inviteInfo(a) {
   let [_, code] = a.match(/chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i) || []
   if (!code) return { status: 403 }
   let res = await this.query({
    json: ["query", "invite", code]
  })
  if (res.status != 200) return res
  return res
}
  async toMSG(buffer, type) {
   let data = await this.prepareMessage('0@s.whatsapp.net', buffer, type, { thumbnail: Buffer.alloc(0) })
   data = Object.keys(data.message)[0] == 'ephemeralMessage' ? data.message.ephemeralMessage : data.message
   return data[type]
}
    /**
     * Parses string into mentionedJid(s)
     * @param {String} text 
     */
    parseMention(text = '') {
      return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }

    /**
     * Get name from jid
     * @param {String} jid 
     * @param {Boolean} withoutContact
     */
    getName(jid, withoutContact = true) {
    if (jid.endsWith('g.us')) return this.contacts[jid]?.name || jid
      withoutContact = this.withoutContact || withoutContact
      let v = jid === '0@s.whatsapp.net' ? {
        jid,
        vname: 'WhatsApp'
      } : jid === this.user.jid ?
        this.user :
        this.contactAddOrGet(jid)
      return (withoutContact ? '' : v.name) || v.vname || v.notify || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    /**
     * Download media message
     * @param {Object} m 
     */
    async downloadM(m) {
      if (!m) return Buffer.alloc(0)
      if (!m.message) m.message = { m }
      if (!m.message[Object.keys(m.message)[0]].url) await this.updateMediaMessage(m)
      return await this.downloadMediaMessage(m)
    }

    /**
     * Serialize Message, so it easier to manipulate
     * @param {Object} m 
     */
    serializeM(m) {
      return exports.smsg(this, m)
    }
  }

  return WAConnection
}

/**
 * Serialize Message
 * @param {WAConnection} conn 
 * @param {Object} m 
 * @param {Boolean} hasParent 
 */
exports.smsg = (conn, m, hasParent) => {
  if (!m) return m
  let M = WAMessageProto.WebMessageInfo
  if (m.key) {
    m['message_id'] = m.key.id
    m.id = m.key.id
    m.isBaileys = m.id.startsWith('XYZ0') || m.id.startsWith('3EB0') && m.id.length === 12
    m.chat = m.key.remoteJid
    m.fromMe = m.key.fromMe
    m.isGroup = m.chat.endsWith('@g.us')
    m.sender = m.fromMe ? conn.user.jid : m.participant ? m.participant : m.key.participant ? m.key.participant : m.chat
  //  db_user = require('../database').users[m.sender]
    //m['from'] = { id: m.sender, name: (conn.contacts[m.sender].vname || conn.contacts[m.sender].notify), exp: db_user.exp, limit: db_user.limit, level: db_user.level }
  }
     
  if (m.message) {
    m.mtype = Object.keys(m.message)[0]
    m.msg = m.message[m.mtype]
    if (m.mtype === 'ephemeralMessage') {
      exports.smsg(conn, m.msg)
      m.mtype = m.msg.mtype
      m.msg = m.msg.msg
    }
    let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
    m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
    if (m.quoted) {
      let type = Object.keys(m.quoted)[0]
      m.quoted = m.quoted[type]
      if (['productMessage'].includes(type)) {
        type = Object.keys(m.quoted)[0]
        m.quoted = m.quoted[type]
      }
      if (typeof m.quoted === 'string') m.quoted = { text: m.quoted }
      m.quoted.mtype = type
      m.quoted.id = m.msg.contextInfo.stanzaId
      m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
      m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('XYZ0') || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 12 : false
      m.quoted.sender = m.msg.contextInfo.participant
      m.quoted.fromMe = m.quoted.sender === (conn.user && conn.user.jid)
      m.quoted.text = m.quoted.text || m.quoted.caption || ''
      m.quoted.mentionedJid = m.quoted.contextInfo ? m.quoted.contextInfo.mentionedJid : []
      m.getQuotedObj = m.getQuotedMessage = async () => {
        if (!m.quoted.id) return false
        let q = await conn.loadMessage(m.chat, m.quoted.id)
        return exports.smsg(conn, q)
      }
      if (m.key.remoteJid.endsWith('g.us')) {
     m.groupData = async () => {
       let data = await conn.groupMetadata(m.key.remoteJid)
        data.picture = await conn.getProfilePicture(m.key.remoteJid)
        return data
      }
     }
      let vM = m.quoted.fakeObj = M.fromObject({
        key: {
          fromMe: m.quoted.fromMe,
          remoteJid: m.quoted.chat,
          id: m.quoted.id
        },
        message: quoted,
        ...(m.isGroup ? { participant: m.quoted.sender } : {})
      })
      if (m.quoted.url) m.quoted.download = (type = 'buffer') => conn.downloadM(vM, type)
      /**
       * Reply to quoted message
       * @param {String|Object} text 
       * @param {String|false} chatId 
       * @param {Object} options 
       */
      m.quoted.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, vM, options)
      /**
       * Copy quoted message
       */
      m.quoted.copy = () => exports.smsg(conn, M.fromObject(M.toObject(vM)))
      /**
       * Forward quoted message
       * @param {String} jid 
       * @param {Boolean} forceForward 
       */
      m.quoted.forward = (jid, forceForward = false) => conn.forwardMessage(jid, vM, forceForward)
      /**
       * Exact Forward quoted message
       * @param {String} jid 
       * @param {Boolean} forceForward 
       * @param {Object} options 
       */
      m.quoted.copyNForward = (jid, forceForward = false, options = {}) => conn.copyNForward(jid, vM, forceForward, options)
      /**
       * Modify quoted Message
       * @param {String} jid 
       * @param {String} text 
       * @param {String} sender 
       * @param {Object} options 
       */
      m.quoted.cMod = (jid, text = '', sender = m.quoted.sender, options = {}) => conn.cMod(jid, vM, text, sender, options)
      /**
       * Delete quoted message
       */
      m.quoted.delete = () => conn.deleteMessage(m.quoted.chat, vM.key)
    }
    if (m.msg.url) m.download = (type = 'buffer') => conn.downloadM(m, type)
    m.text = (m.mtype == 'buttonsResponseMessage' ? m.message.buttonsResponseMessage.selectedButtonId : '') || (m.mtype == 'listResponseMessage' ? m.msg.singleSelectReply.selectedRowId : '') || m.msg.text || m.msg.caption || m.msg || ''
    /**
     * Reply to this message
     * @param {String|Object} text 
     * @param {String|false} chatId 
     * @param {Object} options 
     */
    m.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, m, options)
    /**
     * Copy this message
     */
    m.copy = () => exports.smsg(conn, M.fromObject(M.toObject(m)))
    /**
     * Forward this message
     * @param {String} jid 
     * @param {Boolean} forceForward 
     */
    m.forward = (jid = m.chat, forceForward = false) => conn.forwardMessage(jid, m, forceForward)
    /**
     * Exact Forward this message
     * @param {String} jid 
     * @param {Boolean} forceForward 
     * @param {Object} options 
     */
    m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => conn.copyNForward(jid, m, forceForward, options)
    /**
     * Modify this Message
     * @param {String} jid 
     * @param {String} text 
     * @param {String} sender 
     * @param {Object} options 
     */
    m.cMod = (jid, text = '', sender = m.sender, options = {}) => conn.cMod(jid, m, text, sender, options)
  }
  return m
}

exports.logic = (check, inp, out) => {
  if (inp.length !== out.length) throw new Error('Input and Output must have same length')
  for (let i in inp) if (util.isDeepStrictEqual(check, inp[i])) return out[i]
  return null
}
