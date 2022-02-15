// NO MODIFICAR ABSOLUTAMENTE NADA DE AQUI
let handler = async (m, { conn, text }) => {
    let name = m.fromMe ? conn.user : conn.contacts[m.sender]

  conn.reply(m.chat, `
❕ *La información que se proporcionará no excluye a Propietario/a del Bot, Sub Bot, o usuario del Bot de las posibles sanciones.* 

❕ *NO nos hacemos responsables del desconocimiento que pueda tener de temas del Bot.*

⚠️ *_Términos de Privacidad_*

_- La información que reciba por parte del Bot NO es compartida con nadie._

_- Las imágenes, vídeos, stickers, audios, logos, etc.. NO son compartidas con nadie._

_-  El Bot es posible que no esté activado las 24 horas, no excluye que él/la Propietario/a pueda hacerlo._

_- NO nos hacemos responsables del posible mal uso de un Sub Bot, es recomendable que use número virtual._

_- Los Audios, notas de voz, imágenes, vídeos u otro archivo multimedia de Propiedad del Bot, son exclusivamente para este Bot de haber otros Bots con dicha multimedia, sé investigará._

⚠️ *_Condiciones de Edición_* 

_Este Bot procede de un Bot ya existente por parte de The Brokers, únicamente lo que hace es Editar, agregar nuevos comandos, actualizar comandos, nuevas interfaces, etc... NO se pretende hacerlo pasar por un Bot diferente al inicial._

💬 *_Mensajes del Bot_*

_- En caso que el Bot envíe mensajes sin haber solicitado con un comando, es posible que el mensaje sea de una persona o propietario/a del Bot. De ser así mantener el respeto._

❔ *_Aún tienes dudas_*

_De tener dudas, observaciones, reclamos respecto a temas del Bot puedes escribir me a este número:_

📲 Wa.me/593968585383

*_Recuerda mantener el respeto, escribir para temas serios. Gracias_*

                             🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈
`.trim(), m)
    let mentionedJid = [m.sender]
}
    
handler.customPrefix = /términos y condiciones y privacidad|terminosycondicionesyprivacidad|terminosycondiciones|terminos y condiciones y privacidad|terminos y condiciones|terminos y condiciones|terminos de uso|Terminos de uso|Terminó se uso|términos de uso|Términos de uso|Términos y condiciones/i
handler.command = new RegExp

module.exports = handler 
