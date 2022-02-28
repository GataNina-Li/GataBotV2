let handler  = async (m, { conn, text }) => {
  let groups = conn.chats.all().filter(v => v.jid.endsWith('g.us') && !v.read_only && v.message).map(v => v.jid)
  let content = (/bcgc|broadcastgroup|bcgrup|bcgrup|broadcastgc/i.test(text) ? text : text + '\n' + readMore + '「 ' + conn.getName(conn.user.jid) + ' Mensaje de difusion en grupos 」')
  for (let id of groups) conn.sendMessage(id, content, m.mtype, m.msg.contextInfo ? {
    contextInfo: m.msg.contextInfo
  } : {})
  conn.reply(m.chat, `*_Envíando el mensaje de difusión a ${groups.length} grupos_*`, m)
}
handler.help = ['broadcastgroup','bcgc'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(broadcast|bc)(group|grup|gc)$/i 
handler.rowner = true

handler.fail = null

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

