function handler(m) {
  //this.sendContact(m.chat, global.owner[0], this.getName(global.owner[0] + '@s.whatsapp.net'), m)
  this.sendContact(m.chat, '14502335923', 'SHADOW N1 - CREADOR - OFICIAL', m)
  this.sendContact(m.chat, '17722386341', 'SHADOW N2 - CREADOR - OFICIAL', m)
  this.sendContact(m.chat, '14503280343', 'SHADOW N3 - CREADOR - OFICIAL', m)
  }
handler.help = ['contacto']
handler.tags = ['info']
 
handler.command = /^(contacto|owner|creator|creador|propietario|dueño)$/i

module.exports = handler
