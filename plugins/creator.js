function handler(m) {
  this.sendContact(m.chat, global.owner[0], this.getName(global.owner[0] + '@s.whatsapp.net'), m)
  this.sendContact(m.chat, '593993684821', 'Bot principal', m)
  this.sendContact(m.chat, '593968585383', 'Gata Dios', m)
  this.sendContact(m.chat, '17722386341', 'The Shadow', m)
  }
handler.help = ['contacto']
handler.tags = ['info']
 
handler.command = /^(contacto|owner|creator|creador|propietario|dueño)$/i

module.exports = handler
