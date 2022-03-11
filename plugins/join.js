let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i

let handler = async (m, { conn, text, isMods, isOwner }) => {
    let link = (m.quoted ? m.quoted.text ? m.quoted.text : text : text) || text
    let [_, code] = link.match(linkRegex) || []
    if (!code) throw '*❰ ⚠️ ❱ Link erroneo o incompleto*\n*👉 Inserte un enlace de unión de un grupo de WhatsApp*\n\n*Ejemplo:*\n*#join https://chat.whatsapp.com/Eg7m7mmb85IDLnSgFooDg6*\n\n*❰ ❗️ ❱ No responda a un mensaje porque causa interferencia, escribalo como un mensaje nuevo*'
    if (isMods || isOwner || m.fromMe) {
        let res = await conn.acceptInvite(code)
        m.reply(`*✅ El Bot se unió con éxito al grupo*`)
    } else {
        for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) m.reply('❰ ❗️ ❱ *SOLICITUD DE BOT PARA UN GRUPO*\n\n*Nunero solicitante:* ' + 'wa.me//' + m.sender.split('@')[0] + '\n*Link del grupo:* ' + link, jid)
        m.reply('*❰ ❗️ ❱ El link de su grupo fue enviado a mí propietario/a*\n\n*❰ ❕ ❱ Su grupo será evaluado y quedara a criterio del propietario/a del Bot si añade o no al Bot a su grupo; si no ingresa al Grupo dentro de 24 horas no insista.*\n\n*❰ ❗️ ❱ Algunas posibles causas que el Bot no se añada:*\n*1️⃣ El Bot se encuentra saturado*\n*2️⃣ El Bot fue eliminado recientemente del grupo*\n*3️⃣ Se restableció el link del grupo*\n*4️⃣ El Bot no se agrega a grupos*\n\n*❰ ❕ ❱ Ten en cuenta que tu solicitud para unir el Bot a tu grupo puede demorar algunas horas en ser respondida.*\n\n*❰ ❕ ❱ En el caso que el Bot haya ingresado, es recomendable promover a Admin para que funcione correctamente.*\n\n*❰ ❕ ❱ Si el Bot se sale del Grupo intencionalmente pueda que este saturado, de ser posible use .jadibot para que usted pueda ser un Bot.*')
    }
}
handler.help = ['join [chat.whatsapp.com]']
handler.tags = ['premium']

handler.command = /^unete|join|nuevogrupo$/i

module.exports = handler
