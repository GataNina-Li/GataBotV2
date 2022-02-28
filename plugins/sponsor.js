let handler  = async (m, { conn, usedPrefix: _p }) => {
let info = `
*------ 𝐁𝚬𝚬𝐓•𝚴𝚯𝐃𝐄𝐒 ------*
*=> ¿ℚ𝕦𝕚𝕖𝕣𝕖𝕤 𝕥𝕖𝕟𝕖𝕣 𝕦𝕟 𝔹𝕠𝕥 𝕒𝕔𝕥𝕚𝕧𝕒𝕕𝕠 𝟚𝟜/𝟟 𝕪 𝕤𝕚𝕟 𝕦𝕥𝕚𝕝𝕚𝕫𝕒𝕣 𝕥𝕖𝕣𝕞𝕦𝕩?* 
*➤ Beet-Nodes viene para quedarse!! Beet-Nodes es un servidor/host que mantendrá tu Bot activado 24/7 y sin la necesidad de que este viendo que no se apague, con una interfaz muy sencilla, precios accesibles y un soporte excelente podrás activar cualquier Bot para tenerlo a tu disposición* 

*➤ Host: https://billing.hirobeet.xyz*
*➤ Para mas informacion contacta con Hiro al wa.me/447309247974*
*➤ ¿Necesitas ayuda? unete a su grupo OFC https://chat.whatsapp.com/KYGR5bIPuMA9OzjMWmN*
*=> Solo interesados en el abrir su servidor*
*=> No permitido Bots en el grupo*

*_Coᴘʏʀɪɢʜᴛ 2021-2022_*
*_Cᴏɴғᴜ ᴘʀᴏᴘɪᴇᴅᴀᴅ ᴅᴇ ʜɪʀᴏ_*
*_Hɪʀᴏ ᴘʀᴏᴘɪᴇᴅᴀᴅ ᴅᴇ ᴄᴏɴғᴜ_*
*_Tᴏᴅᴏs ʟᴏs ᴅᴇʀᴇᴄʜᴏs ʀᴇsᴇʀᴠᴀᴅᴏs_*
`.trim() 

conn.fakeReply(m.chat, info, '0@s.whatsapp.net', '*🔥 BEET-NODES 🔥*', 'status@broadcast')
}
handler.command = /^sponsor$/i

module.exports = handler
