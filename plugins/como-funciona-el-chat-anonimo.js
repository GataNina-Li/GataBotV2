let handler  = async (m, { conn, usedPrefix: _p }) => {
let info = `
👤 El chat Anónimo funciona solo al privado del Bot.

👥 Consiste en usar el número del Bot para hablar con otras personas, es decir las dos personas estarán a la vez escribiendo por el chat privado del Bot, de esa manera ninguna 🔒de las dos personas pueden ver su número, Foto, usuario, descripción etc... 🔒

✨ Para poder hacer uso de esta función debes hacer lo siguiente:

⚡️ Ingresa al chat privado del Bot
⚡️ Escribe es siguiente comando

#start 

✅ Una vez hecho lo anterior solo tienes que tener paciencia a que otra persona use el mismo comando (#start) para poder ser vinculados por medio del número del Bot y empezar a interactuar 

✅ Si dejas activado el #start tendrás más posibilidades de interactuar con la otra persona de forma Anónima 

🚪 En caso que quieras salir del chat anónimo usa el siguiente comando 

#leave 

✅ De esa forma ya dejarás de estar en el chat anónimo del Bot

❰ ❗️ ❱ No nos hacemos responsables del mal uso que le puedas dar a esta función del Bot.
`.trim() 

conn.fakeReply(m.chat, info, '0@s.whatsapp.net', '🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈', 'status@broadcast')
}
handler.command = /^(anonimochat|chatanonimo|AnonimoChat|ChatAnonimo|chatanónimo|anónimochat|anonimoch)$/i 

module.exports = handler
