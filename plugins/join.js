let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i

let handler = async (m, { conn, text, isMods, isOwner }) => {
    let link = (m.quoted ? m.quoted.text ? m.quoted.text : text : text) || text
    let [_, code] = link.match(linkRegex) || []
    if (!code) throw '*[ ⚠️ ] Link erroneo o faltante*\n*👉🏻 Inserte un enlace de unión de un grupo de WhatsApp*\n\n*Ejemplo:*\n*#join https://chat.whatsapp.com/FwEUGxkvZD85fIIp0gKyFC*\n\n*[❗] No responda a un mensaje porque causa interferencia, escribalo únicamente como un mensaje nuevo*'
    if (isMods || isOwner || m.fromMe) {
        let res = await conn.acceptInvite(code)
        m.reply(`*✅ El Bot se unió con éxito al grupo*`)
    } else {
        for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) m.reply('*[❗] SOLICITUD DE BOT PARA UN GRUPO [❗]*\n\n*Nunero solicitante:* ' + 'wa.me//' + m.sender.split('@')[0] + '\n*Link del grupo:* ' + link, jid)
        m.reply('*[❗] El link de su grupo fue enviado a mi propietario*\n\n*👉🏻 Su grupo será evaluado y quedara a criterio del propietario del Bot si añade o no al Bot a su grupo*\n\n*[❗] Algunas posibles causas que el Bot no se añada:*\n*1.- El Bot se encuentra saturado*\n*2.- El Bot fue sacado recientemente del grupo*\n*3.- Se restableció el link del grupo*\n*4.- El Bot no se agrega a grupos*\n\n*👉🏻 Ten en cuenta que tu solicitud para unir el Bot a tu grupo puede demorar algunas horas en ser respondida*')
    }
}
handler.help = ['join [chat.whatsapp.com]']
handler.tags = ['premium']

handler.command = /^unete|join|nuevogrupo$/i

module.exports = handler