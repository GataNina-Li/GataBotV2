let handler = async (m, { conn, text }) => {
    let name = m.fromMe ? conn.user : conn.contacts[m.sender]

  conn.reply(m.chat, `
⚙️ *FORMATOS DE USOS* 

💫 *Para crear Audios:*
#tts (código) (texto)

⚡️ *Ejemplo:*
#tts es Hola mundo 


💫 *Para traducir:*
#traducir (código) (texto) 

⚡️ *Ejemplo:*
#traducir es Hello world
*Resultado:* Hola mundo

👇 *¡Más Códigos de idiomas!*

⚙️ *LISTA DE CÓDIGOS:* 
  'af': 'Afrikaans',
  'sq': 'Albanian',
  'ar': 'Arabic',
  'hy': 'Armenian',
  'ca': 'Catalan',
  'zh': 'Chinese',
  'hr': 'Croatian',
  'cs': 'Czech',
  'da': 'Danish',
  'nl': 'Dutch',
  'en': 'English',
  'eo': 'Esperanto',
  'fi': 'Finnish',
  'fr': 'French',
  'de': 'German',
  'el': 'Greek',
  'ht': 'Haitian Creole',
  'hi': 'Hindi',
  'hu': 'Hungarian',
  'is': 'Icelandic',
  'id': 'Indonesian',
  'it': 'Italian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'la': 'Latin',
  'lv': 'Latvian',
  'mk': 'Macedonian',
  'no': 'Norwegian',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'ro': 'Romanian',
  'ru': 'Russian',
  'sr': 'Serbian',
  'sk': 'Slovak',
  'es': 'Spanish',
  'sw': 'Swahili',
  'sv': 'Swedish',
  'ta': 'Tamil',
  'th': 'Thai',
  'tr': 'Turkish',
  'vi': 'Vietnamese',
  'cy': 'Welsh'
`.trim(), m)
    let mentionedJid = [m.sender]
}
handler.customPrefix = /CÓDIGOS PARA AUDIOS|Codigos para audios|codigos para audios|codigosparaaudios|códigos para audios|Códigos para audios/i
handler.command = new RegExp

module.exports = handler
