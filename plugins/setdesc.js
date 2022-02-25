let handler = async (m, { conn, args }) => {
 await conn.groupUpdateDescription(m.chat, `${args.join(" ")}`);
  m.reply('*✅ La descripción del grupo se modifico correctamente*') 
}

handler.help = ['Setdesk <text>']
handler.tags = ['group']
handler.command = /^setdesk|setdesc$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false
handler.register = false
handler.admin = true
handler.botAdmin = true

module.exports = handler
